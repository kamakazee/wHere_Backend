const { fetchImageById, postImage } = require("../models/images-model");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const {
  imageModel
} = require("../schema/schema");

exports.getImageById = (req, res, next) => {
  const { id } = req.params;

  fetchImageById(id).then((imageObject) => {
    res.send(imageObject);
  });
};

exports.addImage = (req, res, next) => {

  console.log("Inside of post", req.file.filename);
  const newFile = req.file.filename
  const imageName = req.body.name

  postImage(newFile, imageName).then((image) => {
    console.log(image)
    res.status(204).send("Image uploaded Id: ", image)
  })

}