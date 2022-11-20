const {itemModel, containerModel} = require("../schema/schema")

exports.fetchAllItems = async () => {
  try {
    const items = await itemModel.find({});
    return items;
  } catch (error) {
    return error;
  }
}

const postItem = async (itemBody) => {
  const item = new itemModel(itemBody);

  try {
    await item.save();
    return item;
  } catch (error) {
    return error;
  }
};

const updateContainerByIdWithItem = async (parent_id, item) => {

  try {
    await containerModel.findOneAndUpdate(
      { _id: parent_id },
      { $push: { contains: item } }
    );

    return item._id.toString();
  } catch (error) {
    return error
  }
};

exports.postItemWithParentId = async (name, description, parentId, imageId)=>{


  const itembody = {
    name: name,
    description: description,
    parent_id: parentId,
    image: imageId,
  };

  return postItem(itembody).then((item) => {

    return updateContainerByIdWithItem(parentId, item)

  }).then(
    (item_id) => {

      return item_id
    }
  );

}