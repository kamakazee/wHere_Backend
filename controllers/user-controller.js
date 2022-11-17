const { fetchAllUsers, postNewUser } = require("../models/user-model");

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      console.log(users);
      res.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
};

exports.addUser = (req, res, next) => {
  const userBody = req.body;

  postNewUser(userBody)
    .then((user) => {
      console.log(user);
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};
