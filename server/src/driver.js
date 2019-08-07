const db = require("./db")
const connection = db.connection;

const hasAllProperties = (obj, props) => {
  for (let i = 0; i < props.length; i++) {
    if (!obj.hasOwnProperty(props[i])) {
      return false;
    }
  }
  return true;
};

exports.handleAcceptPackage = (req, resp) => {
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
exports.handleDelivered = (req, resp) => {
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
