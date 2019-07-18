var express = require("express");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var mysql = require("mysql");

var app = express();

var connection = mysql.createConnection({
  host: "192.168.17.4",
  port: "3306",
  user: "root",
  password: "",
  database: "test"
});

function verifyJWTMiddleware(req, resp, next) {
  var tokenHeader = jwt.verify(
    req.header("Authorization").substring(7),
    "STRING",
    function(err, decoded) {
      if (decoded) next();
      else if (err) resp.status(500).send({ message: err });
      else {
        resp.status(401).send({ message: "ERROR: User not logged in!" });
      }
    }
  );
}

connection.connect();

app.use(bodyParser.json());

const hasAllProperties = (obj, props) => {
  for (let i = 0; i < props.length; i++) {
    if (!obj.hasOwnProperty(props[i])) {
      return false;
    }
  }
  return true;
};

function handleRegister(req, resp) {
  // Get JSON

  if (
    !hasAllProperties(req.body, [
      "username",
      "name",
      "email",
      "password",
      "address"
    ])
  ) {
    resp.send({ message: "ERROR: Properties are missing!" });
    return;
  }

  // Insert Into DB
  connection.query(
    `INSERT INTO user (username, name, email, password, address,status) VALUES ('${
      req.body.username
    }', '${req.body.name}', '${req.body.email}', '${
      req.body.password
    }', '${JSON.stringify(req.body.address)}', 'notAvailable')`,
    function(err, res) {
      if (err) {
        if (err.code == "ER_DUP_ENTRY") {
          resp.status(400).send({ message: "ERROR: Username is not unique" });
        } else {
          resp.status(500).send({ message: err });
        }
      } else {
        resp.send({ username: req.body.username });
      }
    }
  );
}

function handleLogin(req, resp) {
  if (!hasAllProperties(req.body, ["username", "password"])) {
    res.status(400).send({
      message: "ERROR: Properties are missing!"
    });
  }
  connection.query(
    `SELECT username, password FROM user WHERE username='${req.body.username}'`,
    function(err, res) {
      if (err) {
        resp.status(500).send(err);
      } else if (res.length == 0) {
        resp.status(400).send({ message: "ERROR: Invalid credentials!" });
      } else if (
        res[0].username != req.body.username &&
        res[0].password != req.body.password
      ) {
        resp.status(400).send({ message: "ERROR: Invalid credentials!" });
      } else {
        // generate JWT
        const token = jwt.sign({ username: req.body.username }, "STRING", {
          expiresIn: "24h"
        });
        resp.send({ token: token });
      }
    }
  );
}

// If a customer wants to send a package
function handleSend(req, resp) {
  // get username from url
  var username = req.params["username"];
  if (
    !hasAllProperties(req.body, [
      "size",
      "weight",
      "origin",
      "destination",
      "pickUpTime"
    ])
  ) {
    resp.status(400).send({ message: "ERROR: Properties are missing" });
    return;
  }
  let userid = 0;
  connection.query(
    `SELECT id FROM User WHERE username = '${username}'`,
    (err, res) => {
      if (err) {
        resp.status(500).send({ message: err });
        hasDatabaseError = true;
      } else if (res.length == 0) {
        resp.status(400).send({ message: "ERROR: Can not find user!" });
        hasDatabaseError = true;
      } else {
        userid = res[0].id;

        connection.query(
          `INSERT INTO packet (status, size, weight, origin, destination, pickuptime, senderid) VALUES (
          'waiting', '${JSON.stringify(req.body.size)}', '${
            req.body.weight
          }', '${req.body.origin}', '${req.body.destination}',
          '${JSON.stringify(req.body.pickUpTime)}', '${userid}')`,
          (err, res) => {
            if (err) {
              resp.status(500).send({ message: err });
            } else {
              resp.send({ packetID: res.insertId });
            }
          }
        );
      }
    }
  );
}

function handleAcceptPackage(req, resp) {
  const paramUsername = req.params["username"];
  const paramPacketID = req.params["packetID"];

  if (paramUsername == "" || paramPacketID == "") {
    res.status(400).send({ message: "ERROR: Missing parameters" });
    return;
  }

  // Validate package id
  connection.query(
    `SELECT Packetid FROM packet WHERE Packetid = ${paramPacketID}`,
    (err, result) => {
      if (err) {
        resp.status(500).send({ message: err });
      } else if (result.length != 1) {
        resp.status(400).send({ message: "ERROR: Could no identify packet" });
      } else {
        // get userid
        connection.query(
          `SELECT id, status FROM user WHERE username = '${paramUsername}' `,
          (err, resultUser) => {
            if (err) {
              resp.status(500).send({ message: err });
            } else if (resultUser.length != 1) {
              resp.send({ message: "ERROR: Could no identify user" });
            } else if (resultUser[0].status == "notAvailable") {
              resp.send({ message: "User is currently not available" });
            } else {
              // Update user status
              connection.query(
                `UPDATE user SET status = 'sending' WHERE id = '${
                  resultUser[0].id
                }'`,
                (err, resultUpdateUser) => {
                  if (err) {
                    resp.status(500).send({ message: err });
                  } else {
                    connection.query(
                      `UPDATE packet SET status = 'isdelivering', driverid='${
                        resultUser[0].id
                      }'  WHERE packetid = '${paramPacketID}'`,
                      (err, resultUpdateUser) => {
                        if (err) {
                          resp.status(500).send({ message: err });
                        } else {
                          resp.send({ packetID: paramPacketID });
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
}

// driver deliverd a packet
function handleDelivered(req, resp) {
  if (!hasAllProperties(req.body, ["username", "packetID"])) {
    resp.status(400).send({ message: "ERROR: Properties are missing" });
    return;
  }

  connection.query(
    `SELECT username FROM user RIGHT JOIN packet ON (user.id = packet.driverid) WHERE username = '${
      req.body.username
    }' AND packet.Packetid = '${
      req.body.packetID
    }' AND packet.status = 'isdelivering'`,
    (err, result) => {
      if (err) {
        resp.status(500).send({ message: err });
      } else if (result.length == 0) {
        resp.status(400).send({ message: "ERROR: Did not find a valid user" });
      } else if (result.length > 1) {
        resp.status(500).send({ message: "ERROR: Internat error." });
      } else {
        connection.query(
          `UPDATE packet SET status = 'arrived' WHERE packetid = '${
            req.body.packetID
          }'`,
          (err, _) => {
            if (err) {
              resp.status(500).send({ message: err });
            } else {
              // update user status
              connection.query(
                `UPDATE user SET status = 'available' WHERE username = '${
                  req.body.username
                }'`,
                (err, resultUpdateUser) => {
                  if (err) {
                    resp.status(500).send({ message: err });
                  }
                  resp.send({ packetID: req.body.packetID });
                }
              );
            }
          }
        );
      }
    }
  );
}

function handleGetPacket(req, resp) {
  const paramPacketID = req.params["id"];

  connection.query(
    `SELECT * FROM packet WHERE packetid = '${paramPacketID}'`,
    (err, result) => {
      if (err) {
        resp.status(500).send({ message: err });
      } else {
        if (result.length == 1) {
          resp.send(result[0]);
        } else if (result.length == 0) {
          resp.send({});
        } else {
          // result should only consist of one or zero packets
          resp.status(500).send({ message: "ERROR: Internal error" });
        }
      }
    }
  );
}

function handleGetPackets(req, resp) {
  connection.query(`SELECT * FROM packet`, (err, result) => {
    if (err) {
      resp.status(500).send({ message: err });
    } else {
      resp.send(result);
    }
  });
}

function handleChangeStateAvailable(req, resp) {
  const username = req.params["username"];
  connection.query(
    `UPDATE user SET status='available' WHERE username='${username}'`,
    (err, result) => {
      if (err) {
        resp.status(500).send({ message: err });
      } else {
        resp.send({ message: "Status set" });
      }
    }
  );
}

function handleChangeStateNotAvailable(req, resp) {
  const username = req.params["username"];
  connection.query(
    `UPDATE user SET status='available' WHERE username='${username}'`,
    (err, result) => {
      if (err) {
        resp.status(400).send({ message: err });
      } else {
        resp.send({ message: "Status set" });
      }
    }
  );
}

app.post(
  "/status/:username/available",
  verifyJWTMiddleware,
  handleChangeStateAvailable
);
app.post(
  "/status/:username/notavailable",
  verifyJWTMiddleware,
  handleChangeStateNotAvailable
);

app.get("/packet/:id", verifyJWTMiddleware, handleGetPacket);
app.get("/packet", verifyJWTMiddleware, handleGetPackets);

app.post("/register", handleRegister);
app.post("/login", handleLogin);

// protected routes
app.post("/customer/:username/send", verifyJWTMiddleware, handleSend);

app.post(
  "/driver/:username/accept/:packetID",
  verifyJWTMiddleware,
  handleAcceptPackage
);
app.post("/driver/delivered", verifyJWTMiddleware, handleDelivered);

app.listen(3000, function() {
  console.log("Serving...(Port: 3000)");
});

// connection.end();
