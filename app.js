const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const connection = require("./db/connection")
const multer = require("multer");

const { getAllUsers, addUser } = require("./controllers/user-controller")

const {
  getAllContainers,
  addContainer,
  getContainerById,
  getRooms, addNewContainer
} = require("./controllers/containers-controller");
const {getImageById, addBufferedImage} = require("./controllers/images-controller")

const {getAllItems} = require("./controllers/items-container")

const {
  containerModel,
  itemModel,
  imageModel,
} = require("./schema/schema");

const storage = multer.memoryStorage()
const uploadBuffer = multer({ storage: storage })

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/users", getAllUsers);

app.post("/api/add_user", addUser);

app.get("/api/containers", getAllContainers);

app.post("/api/add_container", addContainer); //don't use this one to add new containers

app.get("/api/images/:id", getImageById);

app.get("/api/containers/:id", getContainerById)

app.post("/api/containers/addcontainer/:parent_id", uploadBuffer.single("file"), addNewContainer);

app.get("/api/rooms", getRooms)

app.post("/api/containers/addcontainer/:parent_id", uploadBuffer.single("file"), addNewContainer); //use this one to add a new container

app.get("/api/rooms", getRooms)

app.get("/api/items", getAllItems)

// getAllItems, addItem, getItemById


app.post("/api/add_item", async (request, response) => {
  const item = new itemModel(request.body);

  try {
    await item.save();
    response.send(item);
    await containerModel.findOneAndUpdate(
      { _id: "637371904e79b2a678b82078" },
      { $push: { contains: item } }
    );
    console.log(item);
  } catch (error) {
    response.status(500).send(error);
  }
})

app.get("/api/items/:name", async (request, response) => {
  const getItemById = await itemModel.find({ name: request.params.name });
  try {
    response.send(getItemById);
    console.log("Inside of Item Get");
    console.log(request.params.name);
    console.log(getItemById);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/api/images", (req, res) => {
  //console.log("Inside of GET")

  imageModel.find({}, (err, items) => {
    //find({}
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      const imagesArray = [];

      items.forEach((imageDoc) => {
        const imageObject = {};

        const imageToBase64String = imageDoc.img.data.toString("base64");

        imageObject["name"] = imageDoc._doc.name;
        imageObject["desc"] = imageDoc._doc.desc;
        imageObject["_id"] = imageDoc._doc._id;
        imageObject["img"] = imageToBase64String;
        imagesArray.push(imageObject);
      });

      //console.log(imagesArray[0])

      res.send(imagesArray);
    }
  });
});

// app.post("/api/image", upload.single("file"), addImage);

app.use((err, req, res, next) => {
  console.log("something went wrong: ", err)
  
})


app.post('/api/image', uploadBuffer.single('file'), addBufferedImage)


connection();

module.exports = app;