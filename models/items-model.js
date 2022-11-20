const {itemModel} = require("../schema/schema")

exports.fetchAllItems = async () => {
  try {
    const items = await itemModel.find({});
    return items;
  } catch (error) {
    return error;
  }
} 