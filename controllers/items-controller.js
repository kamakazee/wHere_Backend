const {
  fetchAllItems,
  postItemWithParentId,
  fetchItemById,
  patchItems,
} = require("../models/items-model");
const {
  fetchContainerById,
  deleteItemFromContainer,
} = require("../models/containers-model");
const { postBufferedImage, fetchImageById } = require("../models/images-model");
const { resizeBufferedImage } = require("../db/upload.js");

exports.getAllItems = (req, res, next) => {
  fetchAllItems()
    .then((allItems) => {
      res.status(200).send(allItems);
    })
    .catch((err) => {
      return err;
    });
};

exports.getItemById = (req, res, next) => {
  const { item_id } = req.params;

  const {parent_id}=req.body

  console.log("parent_id", parent_id)

  fetchContainerById(parent_id).then((container)=>{

    container.contains.forEach((element)=>{
      console.log("id", element._id.toString() )
      if(typeof element==="object" && element._id.toString() ===item_id){
        fetchImageById(element.image).then((imageObject)=>{

          element.image = imageObject.img
          res.status(200).send(element)
        })
    
      }
    })
  })
};

exports.addNewItem = (req, res, next) => {
  const itemName = req.body.name;
  const itemDescription = req.body.description;
  const itemParentId = req.params.parent_id;

  resizeBufferedImage(req.file.buffer)
    .then((resized) => {
      postBufferedImage(itemName, resized.buffer).then((imageId) => {
        postItemWithParentId(itemName, itemDescription, itemParentId, imageId)
          .then((item_id) => {
            res.send(`new item created: ${item_id}`);
          })
          .catch((err) => {
            return err;
          });
      });
    })
    .catch((err) => {
      return err;
    });
};

exports.removeItem = (req, res, next) => {
  const { parent_id, item_id } = req.body;

  fetchContainerById(parent_id)
    .then((container) => {
      return deleteItemFromContainer(container, item_id).then((item_id) => {
        res.send(`item removed: ${item_id}`);
      });
    })
    .catch((error) => {
      res.status(404).send(error, "Item was not deleted");
    });
};


exports.editItem = (req, res, next) => {
  const { container_id } = req.params
  const item_id = req.body.item_id
  const name = req.body.name
  const desc = req.body.description;
  const parentId = req.body.parent_id;
  patchItems(container_id, item_id, name, desc, parentId).then(() => {
    res.status(200).send("Item Edited");
  })
    .catch((error) => {
    res.status(404).send(error)
  })
}