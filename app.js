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
  getRooms, addNewContainer, removeContainer, editContainer, getAllItemsFromContainers, fetchContainerNameById, getContainerLocationById
} = require("./controllers/containers-controller");



const {getImageById, addBufferedImage} = require("./controllers/images-controller")

const {getAllItems, getItemById, addNewItem, removeItem, editItem} = require("./controllers/items-controller")

const {getAPI} = require("./controllers/api-controller")

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

app.get("/api", getAPI);

app.get("/api/users", getAllUsers);

app.post("/api/add_user", addUser);

app.get("/api/containers", getAllContainers);

app.get("/api/allitems", getAllItemsFromContainers)

app.post("/api/add_container", addContainer); //don't use this one to add new containers

app.get("/api/images/:id", getImageById);

app.get("/api/containers/:id", getContainerById)

app.get("/api/rooms", getRooms)

app.post("/api/containers/addcontainer/:parent_id", uploadBuffer.single("file"), addNewContainer); //use this one to add a new container

app.post("/api/items/addItem/:parent_id", uploadBuffer.single("file"), addNewItem); 

app.get("/api/rooms", getRooms)

app.get("/api/items", getAllItems)

app.get("/api/items/:item_id", getItemById);

app.get("/api/container/name/:container_id", fetchContainerNameById);

app.post('/api/image', uploadBuffer.single('file'), addBufferedImage)

app.delete("/api/item", removeItem)

app.delete("/api/container/:container_id", removeContainer)

app.patch("/api/editcontainer/:container_id", editContainer)

app.patch("/api/edititem/:container_id", editItem);

app.get("/api/container/location/:container_id", getContainerLocationById)

app.post("/api/add_item", async (request, response) => {
  const item = new itemModel(request.body);

  try {
    await item.save();
    response.send(item);
    await containerModel.findOneAndUpdate(
      { _id: "637371904e79b2a678b82078" },
      { $push: { contains: item } }
    );
  } catch (error) {
    response.status(500).send(error);
  }
})

app.get("/api/items/:name", async (request, response) => {
  const getItemById = await itemModel.find({ name: request.params.name });
  try {
    response.send(getItemById);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/api/images", (req, res) => {

  imageModel.find({}, (err, items) => {

    if (err) {
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

      res.send(imagesArray);
    }
  });
});

app.use((err, req, res, next) => {
  app.use((request, response, next) => {
    response.status(404).send({ status: 404, message: "endpoint doesn't exist" });
    next(err);
  });
  
})

connection();

module.exports = app;

/*


Bathroom   parent_id_array: ["id of home"]

edit bathroom

Cabinette parent_id_array: ["id of bathroom", "id of home"] => not shown in edit of bathroom



*/