const { fetchImageById, postBufferedImage } = require("../models/images-model");

const {resizeBufferedImage} = require("../db/upload.js")

exports.getImageById = (req, res, next) => {
  const { id } = req.params;

  fetchImageById(id).then((imageObject) => {
    res.send(imageObject);
  });
};

exports.addBufferedImage = (req, res, next)=> {
    
  resizeBufferedImage(req.file.buffer).then((resized)=>{

    postBufferedImage(req.body.name, resized.buffer).then((imageId)=>{

        res.send(`New image created: ${imageId}`)
      })
  })
}


