var express = require("express");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var mysql = require("mysql");
var bcrypt = require("bcrypt");

// load .env into device env.
require("dotenv").config();

const customer = require("./customer");
const packet = require("./packet");
const driver = require("./driver");
const status = require("./status");
const db = require("./db")

var app = express();

db.connection.connect();
const connection = db.connection;

function verifyJWTMiddleware(req, resp, next) {
  const token = req.header("Authorization");
  if (token == "" || token.length < 8) {
    resp
      .status(400)
      .send({ message: "ERROR: Missing token or token is to short!" });
    return;
  }

  jwt.verify(token.substring(7), process.env.JWT_PASSWORD, function(
    err,
    decoded
  ) {
    if (decoded) next();
    else if (process.env.JWT_PASSWORD) {
      resp.status(500).send({ message: err });
    } else {
      resp.status(401).send({ message: "ERROR: User not logged in!" });
    }
  });
}

const hasAllProperties = (obj, props) => {
  for (let i = 0; i < props.length; i++) {
    if (!obj.hasOwnProperty(props[i])) {
      return false;
    }
  }
  return true;
};

function handleRegister(req, resp) {
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

  let hash = bcrypt.hashSync(req.body.password, 10);
  console.log(hash);
  // Insert Into DB
  connection.query(
    `INSERT INTO user (username, name, email, password, address,status) VALUES ('${
      req.body.username
    }', '${req.body.name}', '${req.body.email}', '${hash}', '${JSON.stringify(
      req.body.address
    )}', 'notAvailable')`,
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
        !bcrypt.compareSync(req.body.password, res[0].password)
      ) {
        resp.status(400).send({ message: "ERROR: Invalid credentials!" });
      } else {
        // generate JWT
        const token = jwt.sign(
          { username: req.body.username },
          process.env.JWT_PASSWORD,
          {
            expiresIn: "24h"
          }
        );
        resp.send({ token: token });
      }
    }
  );
}

app.use(bodyParser.json());

app.post("/register", handleRegister);
app.post("/login", handleLogin);

// protected routes
app.post(
  "/status/:username/available",
  verifyJWTMiddleware,
  status.handleChangeStatusAvailable
);
app.post(
  "/status/:username/notavailable",
  verifyJWTMiddleware,
  status.handleChangeStatusNotAvailable
);

app.get("/packet/:id", verifyJWTMiddleware, packet.handleGetPacket);

app.get("/packet", verifyJWTMiddleware, packet.handleGetPackets);

app.get(
  "/packet/status/waiting",
  verifyJWTMiddleware,
  packet.handleGetWaitingPackets
);

app.post("/customer/:username/send", verifyJWTMiddleware, customer.handleSend);

app.post(
  "/driver/:username/accept/:packetID",
  verifyJWTMiddleware,
  driver.handleAcceptPackage
);
app.post("/driver/delivered", verifyJWTMiddleware, driver.handleDelivered);

// server start --> Port 3000
app.listen(3000, function() {
  console.log("Serving...(Port: 3000)");
});
