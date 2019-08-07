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

exports.handleSend = (req, resp) => {
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
    `SELECT id FROM user WHERE username = '${username}'`,
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