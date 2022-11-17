const { imageModel } = require("../schema/schema.js");

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