const db = require("./db")
const connection = db.connection;

exports.handleChangeStatusAvailable = (req, resp) => {
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

exports.handleChangeStatusNotAvailable = (req, resp) => {
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
