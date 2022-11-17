const { fetchImageById } = require("../models/images-model");

exports.getImageById = (req, res, next) => {
  const { id } = req.params;

  fetchImageById(id).then((imageObject) => {
    res.send(imageObject);
  });
};
