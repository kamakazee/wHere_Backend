const { containerModel } = require("../schema/schema.js");

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
  console.log(parent_id);

  try {
    await containerModel.findOneAndUpdate(
      { _id: parent_id },
      { $push: { contains: container_id.toString() } }
    );

    console.log("Id to pass back: ", container_id.toString())

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
    console.log(container);

    return updateContainerById(parentId, container._id)

    //res.send(container.name)
  }).then(
    (container_id) => {

      console.log(`new container created: ${container_id}`);

      return container_id
    }
  );

}