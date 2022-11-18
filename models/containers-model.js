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

exports.postContainer = async (containerBody) => {
  const container = new containerModel(containerBody);

  try {
    await container.save();
    return container;
  } catch (error) {
    return error;
  }
};

exports.fetchContainerById = async (id) => {
  try {
    const container = await containerModel.findById(id);
    return container;
  } catch (error) {
    return error;
  }
};

exports.updateContainerById = async (parent_id, container_id) => {
  console.log(parent_id);

  try {
    await containerModel.findOneAndUpdate(
      { _id: parent_id },
      { $push: { contains: container_id.toString() } }
    );

    return container_id;
  } catch (error) {
    response.status(500).send(error);
  }
};
