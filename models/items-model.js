const { itemModel, containerModel } = require("../schema/schema");
const {
  fetchContainerById,
  pushItemIntoContainer,
  pullItemFromContainer,
} = require("./containers-model");

exports.fetchAllItems = async () => {
  try {
    const items = await itemModel.find({});
    return items;
  } catch (error) {
    return error;
  }
};

exports.fetchItemById = async (itemId) => {
  try {
    const items = await itemModel.findById(itemId);
    return items;
  } catch (error) {
    return error;
  }
};

const postItem = async (itemBody) => {
  const item = new itemModel(itemBody);

  try {
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
    return error;
  }
};

exports.postItemWithParentId = async (name, description, parentId, imageId) => {
  const itembody = {
    name: name,
    description: description,
    parent_id: parentId,
    image: imageId,
  };

  return postItem(itembody)
    .then((item) => {
      return updateContainerByIdWithItem(parentId, item);
    })
    .then((item_id) => {
      return item_id;
    });
};

exports.patchItems = async (container_id, item_id, name, desc, parentId) => {
  try {
    let done = false;
    return fetchContainerById(container_id)
      .then((data) => {
        for (let i = 0; i < data.contains.length; i++) {
          if (typeof data.contains[i] === "object") {
            if (data.contains[i]._id.toString() === item_id) {
              let newItem = { ...data.contains[i] };
              newItem.name = name;
              newItem.description = desc;
              newItem.parent_id = parentId;
              done = true;

              return pushItemIntoContainer(parentId, newItem).then(() => {
                return pullItemFromContainer(
                  container_id,
                  data.contains[i]
                ).then(() => {
                  return container_id;
                });
              });
            }
          }
        }
        return done;
      })
      .then((done) => {
        if (done === false) throw Error("done");
        return "done";
      });
  } catch (error) {
    return error;
  }
};
