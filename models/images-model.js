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

exports.postBufferedImage = async (name, data) => {
  const imageBody = {
    name: name,
    img: {
      data: Buffer.from(data),
      contentType: "image/png",
    },
  };

  const newImage = new imageModel(imageBody);

  try {
    await newImage.save();

    return newImage._id;
  } catch (error) {
    return error;
  }
};

exports.deleteImageById = async (imageId) => {
  try {
    await imageModel.findOneAndDelete({ _id: imageId });

    return imageId;
  } catch (error) {
    return error;
  }
};
