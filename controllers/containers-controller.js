const { fetchAllContainers, postContainer } = require("../models/containers-model");

exports.getAllContainers = (req, res, next) => {
  fetchAllContainers()
    .then((containers) => {
      console.log(containers);
      res.status(200).send(containers);
    })
    .catch((err) => {
      next(err);
    });
};

exports.addContainer = (req, res, next) => {
  postContainer(req.body)
    .then((container) => {
      console.log(container)
      res.status(200).send(container)
    })
    .catch((err) => {
      next(err);
    })
}

exports.getContainerById = (req, res, next) => {
  fetchContainerById()
}