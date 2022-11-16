const { fetchAllUsers } = require("../models/user-model")

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers()
        .then((users) => {
            console.log(users)
          res.status(200).send(users)
      })
      .catch((err) => {
        next(err);
      });
}