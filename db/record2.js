// const express = require("express");
// const upload = require('./upload.js')

// const {
//   userModel,
//   elementModel,
//   itemModel,
//   imageModel,
// } = require("../schema/schema.js");

// const app = express();

// app.post("/api/add_user", async (request, response) => {
//   const user = new userModel(request.body);

//   console.log("request body", request.body);
//   console.log("user", user);

//   try {
//     await user.save();
//     response.send(user);
//   } catch (error) {
//     response.status(500).send(error);
//   }
// });

// app.post("/api/add_element", async (request, response) => {
//   const element = new elementModel(request.body);

//   console.log("request body", request.body);
//   console.log("element", element);

//   try {
//     await element.save();
//     response.send(element);
//   } catch (error) {
//     response.status(500).send(error);
//   }
// });

// app.get("/api/users", async (request, response) => {

//   const users = await userModel.find({});

//   try {
//     response.send(users);
//   } catch (error) {
//     response.status(500).send(error);
//   }
// });

// app.post("/api/add_item", async (request, response) => {
//   const item = new itemModel(request.body);

//   try {
//     await item.save();
//     response.send(item);
//     await elementModel.findOneAndUpdate(
//       { _id: "637371904e79b2a678b82078" },
//       { $push: { contains: item } }
//     );
//     console.log(item);
//   } catch (error) {
//     response.status(500).send(error);
//   }
// });

// app.get("/api/items/:name", async (request, response) => {
//   const getItemById = await itemModel.find({ name: request.params.name });
//   try {
//     response.send(getItemById);
//     console.log("Inside of Item Get");
//     console.log(request.params.name);
//     console.log(getItemById);
//   } catch (error) {
//     response.status(500).send(error);
//   }
// });

// app.get("/api/images", (req, res) => {
//   //console.log("Inside of GET")

//   imageModel.find({}, (err, items) => {
//     //find({}
//     if (err) {
//       console.log(err);
//       res.status(500).send("An error occurred", err);
//     } else {
//       const imagesArray = [];

//       items.forEach((imageDoc) => {
//         const imageObject = {};

//         const imageToBase64String = imageDoc.img.data.toString("base64");

//         imageObject["name"] = imageDoc._doc.name;
//         imageObject["desc"] = imageDoc._doc.desc;
//         imageObject["_id"] = imageDoc._doc._id;
//         imageObject["img"] = imageToBase64String;
//         imagesArray.push(imageObject);
//       });

//       //console.log(imagesArray[0])

//       res.send(imagesArray);
//     }
//   });
// });

// app.post("/api/image", upload.single("file"), (req, res, next) => {
//   const obj = {
//     name: req.body.name,
//     desc: req.body.desc,
//     img: {
//       data: fs.readFileSync(
//         path.join(__dirname + "/uploads/" + req.file.filename)
//       ),
//       contentType: "image/png",
//     },
//   };

//   imageModel.create(obj, (err, item) => {
//     if (err) {
//       console.log(err);
//     } else {
//       // item.save();
//       console.log("Id of uploaded image", item._id);
//       res.redirect("/");
//     }
//   });
// });

// module.exports = app;
