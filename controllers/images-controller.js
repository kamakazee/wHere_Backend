const { fetchImageById, postBufferedImage } = require("../models/images-model");

const fs = require("fs");

const path = require("path");
const bodyParser = require("body-parser");
const sharp = require ("sharp")

const { imageModel } = require("../schema/schema.js");

exports.getImageById = (req, res, next) => {
  const { id } = req.params;

  fetchImageById(id).then((imageObject) => {
    res.send(imageObject);
  });
};

const resizeBufferedImage = async (buffer) => {

  console.log("Inside of resize3 image: ", buffer);

  try {
     return await sharp(buffer)
      .resize({
        width: 640,
        height: 480,
      }).toBuffer();

  } catch (error) {
    console.log(error);
  }
};

exports.addBufferedImage = (req, res, next)=> {
    
  resizeBufferedImage(req.file.buffer).then((resized)=>{

    console.log("return from resized image",resized.buffer)

    postBufferedImage(req.body.name, resized.buffer).then((imageId)=>{

        res.send(`New image created: ${imageId}`)
      })
  })
}
