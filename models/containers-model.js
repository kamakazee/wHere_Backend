const { containerModel } = require("../schema/schema.js");
const {deleteImageById} = require ("./images-model.js")

exports.fetchAllContainers = async () => {
  try {
    const containers = await containerModel.find({});
    return containers;
  } catch (error) {
    return error;
  }
};

exports.fetchAllRooms = async () => {
  try {
    const rooms = await containerModel.find({ parent_id: "6374f23e0318fa7c71b095ed"})
    return rooms
  } catch (error) {
    return (error)
  }
}


exports.fetchContainerById = async (id) => {
  try {
    const container = await containerModel.findById(id);
    return container;
  } catch (error) {
    return error;
  }
};

const postContainer = async (containerBody) => {
  const container = new containerModel(containerBody);

  try {
    await container.save();
    return container;
  } catch (error) {
    return error;
  }
};

const updateContainerById = async (parent_id, container_id) => {

  try {
    await containerModel.findOneAndUpdate(
      { _id: parent_id },
      { $push: { contains: container_id.toString() } }
    );

    return container_id.toString();
  } catch (error) {
    return error
  }
};

exports.postContainerWithParentId = async (name, description, parentId, imageId)=>{


  const containerbody = {
    name: name,
    description: description,
    parent_id: parentId,
    image: imageId,
  };

  return postContainer(containerbody).then((container) => {

    return updateContainerById(parentId, container._id)

  }).then(
    (container_id) => {

      return container_id
    }
  );

}

exports.deleteItemFromContainer = async (container, item_id)=>{

  let indexOfItem = 0
  let item ={}

      container.contains.forEach((element, index)=>{
        if (typeof element ==="object" && element._id.toString()===item_id){

          //console.log("Object id:", element._id.toString())
          indexOfItem = index
          item = element

        }
      })

      //console.log("Index of item: ", indexOfItem)

      container.contains.splice(indexOfItem,1)

      //console.log("new contains: ", container.contains)

      await container.save()

      //now delete image

      return deleteImageById(item.image).then((imageid)=>{

        //console.log("deleted image: ", imageid)

        return item_id

      })

      
}
