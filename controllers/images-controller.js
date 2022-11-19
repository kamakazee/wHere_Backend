const { fetchImageById, postImage } = require("../models/images-model");

const fs = require("fs");

const path = require("path");
const bodyParser = require("body-parser");
const sharp = require ("sharp")


exports.getImageById = (req, res, next) => {
  const { id } = req.params;

  fetchImageById(id).then((imageObject) => {
    res.send(imageObject);
  });
};

const resizeImage = async (filename) => {
  //console.log("Inside of resize");

  try {
    await sharp(path.join(__dirname, '..', 'db','uploads', `${filename}`))
      .resize({
        width: 640,
        height: 480,
      })
      .toFile(path.join(__dirname, '..', 'db','uploads', `${filename}_resized`));
  } catch (error) {
    console.log(error);
  }
};


exports.addImage = (req, res, next) =>{

  //console.log("Inside of post")

  resizeImage(req.file.filename).then(()=>{

    postImage(req.body.name, req.file.filename ).then((imageId)=>{

      res.send(`New image created: ${imageId}`)

    })

  })

}
