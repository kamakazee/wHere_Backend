const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const connection = require("./db/connection")
const upload = require("./db/upload");
const { getAllUsers } = require("./controllers/user-controller")

const {
  userModel,
  elementModel,
  itemModel,
  imageModel,
} = require("./schema/schema");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/users", getAllUsers);

app.post("/api/add_user", async (request, response) => {
  const user = new userModel(request.body);

  console.log("request body", request.body);
  console.log("user", user);

  try {
    await user.save();
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/api/elements");

app.post("/api/add_element", async (request, response) => {
  const element = new elementModel(request.body);

  console.log("request body", request.body);
  console.log("element", element);

  try {
    await element.save();
    response.send(element);
  } catch (error) {
    response.status(500).send(error);
  }
});



app.post("/api/add_item", async (request, response) => {
  const item = new itemModel(request.body);

  try {
    await item.save();
    response.send(item);
    await elementModel.findOneAndUpdate(
      { _id: "637371904e79b2a678b82078" },
      { $push: { contains: item } }
    );
    console.log(item);
  } catch (error) {
    response.status(500).send(error);
  }
});

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

app.post("/api/image", upload.single("file"), (req, res, next) => {
  const obj = {
    name: req.body.name,
    desc: req.body.desc,
    img: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
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
      res.redirect("/");
    }
  });
});

connection();

// const Db = process.env.ATLAS_URI;

// mongoose.connect(
//   `mongodb+srv://admin:adminPassword123@cluster0.ztwnv9a.mongodb.net/wHereProject?retryWrites=true&w=majority`,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// );

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error: "));
// db.once("open", function () {
//   console.log("Connected successfully");
// });

module.exports = app;