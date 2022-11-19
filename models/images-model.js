const { imageModel } = require("../schema/schema.js");

const fs = require("fs");
const path = require("path");


exports.fetchImageById = async (id) => {
  try {
    const imageById = await imageModel.findById(id);

    const imageObject = {};

    const imageToBase64String = imageById.img.data.toString("base64");

    imageObject["name"] = imageById._doc.name;
    imageObject["desc"] = imageById._doc.desc;
    imageObject["_id"] = imageById._doc._id;
    imageObject["img"] = imageToBase64String;

    return imageObject;
  } catch (error) {
    return error;
  }
};




exports.postImage = async (name, filename)=>{

  //console.log("Inside model of add image")

  const imageBody = {
    name: name,
    img: {
      data: fs.readFileSync(
        path.join(__dirname, '..', 'db','uploads', `${filename}_resized`)
      ),
      contentType: "image/png",
    },
  };

  //console.log("Construct new image object,:", imageBody)

  const newImage = new imageModel(imageBody);

  try {
    await newImage.save();

    //console.log("New image created", newImage._id)

    return newImage._id;
  } catch (error) {
    return error;
  }


}
