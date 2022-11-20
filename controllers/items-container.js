const { fetchAllItems, postItemWithParentId } = require("../models/items-model")
const { postBufferedImage  } = require("../models/images-model");
const {resizeBufferedImage} = require("../db/upload.js")


exports.getAllItems = (req, res, next) => {
    fetchAllItems()
    .then((allItems) => {
        res.status(200).send(allItems)
    })
    .catch((err) => {
        return err
    })
}

exports.addNewItem = (req, res, next) => {

    const itemName = req.body.name
    const itemDescription =  req.body.description
    const itemParentId = req.params.parent_id
  
    resizeBufferedImage(req.file.buffer).then((resized) => {
  
      postBufferedImage(itemName, resized.buffer).then((imageId)=>{
  
        postItemWithParentId(itemName, itemDescription, itemParentId, imageId).then((item_id)=>{
  
          res.send(`new item created: ${item_id}`);
  
        })
  
      })
  
    });
  };