const db = require("./db")
const connection = db.connection;

exports.handleGetPacket = (req, resp) => {
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

exports.handleGetPackets = (req, resp) => {
  connection.query(`SELECT * FROM packet`, (err, result) => {
    if (err) {
      resp.status(500).send({ message: err });
    } else {
      resp.send(result);
    }
  });
}

exports.handleGetWaitingPackets = (req, resp) => {
  connection.query(
    `SELECT * FROM packet WHERE status='waiting'`,
    (err, result) => {
      if (err) {
        resp.status(500).send({ message: err });
      } else {
        resp.send(result);
      }
    }
  );
}
