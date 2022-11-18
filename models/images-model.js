const { imageModel } = require("../schema/schema.js");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const { nextTick } = require("process");

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

const resizeImage = async (filename) => {
  console.log("Inside of resize");

  const currentPath = path.join(__dirname, "..", "db", "uploads", filename);
  const newPath = path.join(
    __dirname,
    "..",
    "db",
    "uploads",
    filename + "_resized"
  );

  try {
    await sharp(currentPath)
      .resize({
        width: 640,
        height: 480,
      })
      .toFile(newPath);
      console.log("completed resize")
  } catch (error) {
    console.log(error);
  }
};

exports.postImage = async (newFile, imageName) => {
  resizeImage(newFile).then(() => {
    console.log("returned from resized");

    const obj = {
      name: imageName,
      img: {
        data: fs.readFileSync(
          path.join(__dirname, "..", "db", "uploads", newFile + "_resized")
        ),
        contentType: "image/png",
      },
    };
    console.log("Image object defined", obj);

    imageModel.create(obj, (err, item) => {
      if (err) {
        console.log(err);
      } else {
        item.save();
        // console.log("Id of uploaded image", item._id);
        // res.send(`Id of uploaded image ${item._id}`);
        console.log(item, "<------");
        return item;
      }
    });
  });
};
