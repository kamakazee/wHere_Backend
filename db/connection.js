const mongoose = require("mongoose");
const Db = process.env.ATLAS_URI;

//console.log(Db,"<<<<<")

const connection = () => {
  mongoose
    .connect(Db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connection;