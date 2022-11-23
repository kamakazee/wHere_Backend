const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const ContainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "defaultImage",
  },
  parent_id: {
    type: String,
    default: "",
  },
  contains: {
    type: Array,
    default: [],
  },
});

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "defaultImage",
  },
  parent_id: {
    type: String,
    default: "",
  },

});

var imageSchema = new mongoose.Schema({
  name: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

const Image = mongoose.model("Image", imageSchema);
const User = mongoose.model("User", UserSchema);
const Container = mongoose.model("Element", ContainerSchema);
const Item = mongoose.model("Item", ItemSchema);

module.exports = {
  userModel: User,
  containerModel: Container,
  itemModel: Item,
  imageModel: Image,
};
