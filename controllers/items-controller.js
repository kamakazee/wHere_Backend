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
const { postBufferedImage } = require("../models/images-model");
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
  const { itemId } = req.params;
  fetchItemById(itemId)
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      return err;
    });
};

exports.addNewItem = (req, res, next) => {
  const itemName = req.body.name;
  const itemDescription = req.body.description;
  const itemParentId = req.params.parent_id;

  resizeBufferedImage(req.file.buffer).then((resized) => {
    postBufferedImage(itemName, resized.buffer).then((imageId) => {
      postItemWithParentId(
        itemName,
        itemDescription,
        itemParentId,
        imageId
      ).then((item_id) => {
        res.send(`new item created: ${item_id}`);
      });
    });
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
      res.status(404).send("Item was not deleted");
    });
};


exports.editItem = (req, res, next) => {
  const { container_id } = req.params
  const item_id = req.body.item_id
  const name = req.body.name
  const desc = req.body.description;
  const parentId = req.body.parent_id;
  patchItems(container_id, item_id, name, desc, parentId).then(() => {
    console.log("<--- done")
    res.status(200).send("Item Edited");
  })
    .catch((error) => {
    res.status(404).send(error)
  })
}