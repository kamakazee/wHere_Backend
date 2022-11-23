const { containerModel } = require("../schema/schema.js");
const { deleteImageById } = require("./images-model.js");

exports.fetchAllContainers = async () => {
  try {
    const containers = await containerModel.find({});
    return containers;
  } catch (err) {
    return err;
  }
};

exports.fetchAllRooms = async () => {
  try {
    const rooms = await containerModel.find({
      parent_id: "6374f23e0318fa7c71b095ed",
    });
    return rooms;
  } catch (err) {
    return err;
  }
};

exports.fetchContainerById = async (id) => {
  try {
    const container = await containerModel.findById(id);
    console.log("found container", container)
    return container;
  } catch (err) {
    return err;
  }
};

const postContainer = async (containerBody) => {
  const container = new containerModel(containerBody);

  try {
    await container.save();
    return container;
  } catch (err) {
    return err;
  }
};

const updateContainerById = async (parent_id, container_id) => {
  try {
    await containerModel.findOneAndUpdate(
      { _id: parent_id },
      { $push: { contains: container_id.toString() } }
    );
    return container_id.toString();
  } catch (err) {
    return err;
  }
};

exports.postContainerWithParentId = async (
  name,
  description,
  parentId,
  imageId
) => {
  const containerbody = {
    name: name,
    description: description,
    parent_id: parentId,
    image: imageId,
  };

  return postContainer(containerbody)
    .then((container) => {
      return updateContainerById(parentId, container._id);
    })
    .then((container_id) => {
      return container_id;
    });
};

exports.deleteItemFromContainer = async (container, item_id) => {
  let indexOfItem = undefined;
  let item = {};

  container.contains.forEach((element, index) => {
    if (typeof element === "object" && element._id.toString() === item_id) {
      indexOfItem = index;
      item = element;
    }
  });

  if (indexOfItem !== undefined) {
    container.contains.splice(indexOfItem, 1);

    await container.save();

    return deleteImageById(item.image).then((imageid) => {
      return imageid;
    });
  } else {
    return Promise.reject({ msg: "failed" });
  }
};

exports.pushArrayIntoParentContainer = async (
  parent_id,
  containsArray,
  container_id
) => {
  try {
    const parentContainer = await containerModel.findById(parent_id);

    if (containsArray.length > 0) {
      containsArray.forEach((element) => {
        parentContainer.contains.push(element);
      });

      let promisesArray = [];

      containsArray.forEach((element, index) => {
        if (typeof element === "object") {
          containsArray[index].parent_id = parent_id;
        } else {
          promisesArray.push(updateParentContainer(element, parent_id));
        }
      });

      Promise.all(promisesArray).then(async (results) => {
        let indexOfContainer = undefined;

        parentContainer.contains.forEach((element, index) => {
          if (typeof element === "string" && element === container_id) {
            indexOfContainer = index;
          }
        });

        parentContainer.contains.splice(indexOfContainer, 1);

        await parentContainer.save();

        return parent_id;
      });
    } else {
      let indexOfContainer = undefined;

      parentContainer.contains.forEach((element, index) => {
        if (typeof element === "string" && element === container_id) {
          indexOfContainer = index;
        }
      });

      parentContainer.contains.splice(indexOfContainer, 1);

      await parentContainer.save();

      return parent_id;
    }
  } catch (err) {
    return err;
  }
};

exports.deleteContainerById = async (container_id) => {
  try {
    await containerModel.findOneAndDelete({ _id: container_id });

    return container_id;
  } catch (err) {
    return err;
  }
};

const updateParentContainer = async (container_id, parent_id) => {
  try {
    await containerModel.findOneAndUpdate(
      { _id: container_id },
      { parent_id: parent_id }
    );

    return container_id;
  } catch (err) {
    return err;
  }
};

const removeContainerFromParent = async (oldParent_id, container_id) => {
  try {
    await containerModel.findByIdAndUpdate(
      { _id: oldParent_id.toString() },
      {
        $pull: { contains: container_id },
      }
    );
  } catch (err) {
    return err;
  }
};

exports.patchContainer = async (container_id, name, desc, parentId) => {
  try {
    const container = await containerModel.findById(container_id);

    await containerModel.findOneAndUpdate(
      { _id: container_id },
      { name: name, description: desc, parent_id: parentId }
    );

    updateContainerById(parentId, container_id).then((container_id) => {
      removeContainerFromParent(container.parent_id, container_id);

      return container_id;
    });
  } catch (err) {
    return err;
  }
};

exports.pushItemIntoContainer = async (parentId, newItem) => {
  try {
    await containerModel.findOneAndUpdate(
      { _id: parentId },
      { $push: { contains: newItem } }
    );
    return parentId;
  } catch (err) {
    return err;
  }
};

exports.pullItemFromContainer = async (container_id, item) => {
  try {
    await containerModel.findOneAndUpdate(
      { _id: container_id },
      { $pull: { contains: item } }
    );
    return container_id;
  } catch (err) {
    return err;
  }
};

exports.getContainerNameById = async (container_id) => {
  try {
    const container = await containerModel.findById(container_id);
    return container.name;
  } catch (err) {
    return err;
  }
};

// const getParentIdById = async (parent_id) => {
//   try {
//     const parent_container = await containerModel.findById(parent_id);
//     return parent_container.parent_id;
//   } catch (err) {
//     return err;
//   }
// };
// exports.getParentIds = async (containers) => {
  
//   let containerCount = 0;

//   let doCount = 0

//   await containers.forEach((container, index) => {
//     const parentIdArray = [];

//     let current_parent_id = container.parent_id;

//     do {
      
//       getParentIdById(current_parent_id).then((parent_id_of_parent) => {
        
//         containerCount++;
//         console.log("Container count: ", containerCount);
//       doCount++
//       console.log("Do Count: ", doCount)


//         current_parent_id = parent_id_of_parent;

//         parentIdArray.push(parent_id_of_parent);
//       });

//       containers[index]._doc.parent_id_array = parentIdArray;

//       if (containerCount === containers.length) {
//         return container;
//       }
//     } while (doCount < containers.length);
//   });
// };
