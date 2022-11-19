const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const connection = require("./db/connection")
const {upload, uploadS3} = require("./db/upload");
const path = require("path");
const bodyParser = require("body-parser");
const sharp = require ("sharp")
const fs = require("fs");
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
const multer = require("multer");



const {
  postContainer,
  updateContainerById,
} = require("./models/containers-model");


const { getAllUsers, addUser } = require("./controllers/user-controller")
const {
  getAllContainers,
  addContainer,
  getContainerById,
  getRooms,
} = require("./controllers/containers-controller");
const {getImageById, addImage} = require("./controllers/images-controller")

const {
  userModel,
  containerModel,
  itemModel,
  imageModel,
} = require("./schema/schema");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/users", getAllUsers);

app.post("/api/add_user", addUser);

app.get("/api/containers", getAllContainers);

app.post("/api/add_container", addContainer);

app.get("/api/images/:id", getImageById);

app.get("/api/containers/:id", getContainerById)

const resizeImage = async (filename) => {
  console.log("Inside of resize");

  try {
    await sharp(__dirname + `/db/uploads/${filename}`)
      .resize({
        width: 640,
        height: 480,
      })
      .toFile(__dirname + `/db/uploads/${filename}_resized`);
  } catch (error) {
    console.log(error);
  }
};

const addNewContainer = (req, res, next) => {
  console.log("Inside of post");

  console.log("body", req.body);

  resizeImage(req.file.filename).then(() => {
    console.log("Back to model");

    const obj = {
      name: req.body.name,
      desc: req.body.desc,
      img: {
        data: fs.readFileSync(
          path.join(__dirname + "/db/uploads/" + req.file.filename + "_resized")
        ),
        contentType: "image/png",
      },
    };

    imageModel.create(obj, (err, item) => {
      if (err) {
        console.log(err);
      } else {
        // item.save();
        console.log("Id of uploaded image", item._id);
        //res.send(`Id of uploaded image ${item._id}`);

        const containerbody = {
          name: req.body.name,
          description: req.body.description,
          parent_id: req.params.parent_id,
          image: item._id,
        };

        postContainer(containerbody).then((container) => {
          console.log(container);

          updateContainerById(req.params.parent_id, container._id).then(
            (container_id) => {
              res.send(`new container created: ${container_id}`);
            }
          );

          //res.send(container.name)
        });
      }
    });
  });
};

app.post("/api/containers/addcontainer/:parent_id", upload.single("file"), addNewContainer);

app.get("/api/rooms", getRooms)

// getAllItems, addItem, getItemById

//post image, get image ref by id, created container with image ref and parent, find one and update parent

/*app.post("/api/image").then((imageID)>{

  parentId
  imageID

  post("/api/container").then((containerid)=>{

    findoneandUp(parentID,  $push    contains:[containerID]).then(()=>{


      res.send("container created:", container)
    })
  })


exporrts.addContainer = (req, res, next) => {
  postImage(image).then((image)=> {
    postContainer(image.id).then((container)=>{
      
      
    nestElement(containerid).then((container)=>{

      res.send(container)
    
    })
    })
  
  })
}

app.post("/api/containers/addcontainer/:parent_id")

insominia

file  (pick a file)

name: container-name
description:


parent_id
contains

}) */

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

app.post("/api/image", upload.single("file"), addImage);

app.use((err, req, res, next) => {
  console.log("something went wrong: ", err)
  
})


const getfile = async (filename)=>{

  try {
    let s3File = await s3.getObject({
      Bucket: process.env.BUCKET,
      Key: filename,
    }).promise()

    // res.set('Content-type', s3File.ContentType)
    // res.send(s3File.Body.toString()).end()
    return s3File
  } catch (error) {
    if (error.code === 'NoSuchKey') {
      console.log(`No such key ${filename}`)
      return error
    } else {
      console.log(error)
      return error
    }
  }
}


const postS3Image = async (name, data)=>{

  console.log("Inside model of add image, data is: ", data)

  const imageBody = {
    name: name,
    img: {
      data: Buffer.from(data),
      contentType: "image/png",
    },
  };

  console.log("Construct new image object,:", imageBody)

  const newImage = new imageModel(imageBody);

  try {
    await newImage.save();

    console.log("New image created", newImage._id)
    console.log(newImage)

    return newImage._id;
  } catch (error) {
    return error;
  }
}
const resizeS3Image = async (buffer) => {

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

const storage = multer.memoryStorage()
const uploadBuffer = multer({ storage: storage })

app.post('/upload', uploadBuffer.single('file'), function(req, res, next) {

  console.log("File uploaded", req.file.buffer)

  // getfile(req.file.key).then((s3File)=>{


    // console.log(s3File.Body)
    
    resizeS3Image(req.file.buffer).then((resized)=>{

      console.log("return from resized image",resized.buffer)

      postS3Image(req.body.name, resized.buffer).then((imageId)=>{

          res.send(`New image created: ${imageId}`)
        })
    })

  // })
})


connection();

module.exports = app;