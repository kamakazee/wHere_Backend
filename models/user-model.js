const {
  userModel,
  elementModel,
  itemModel,
  imageModel,
} = require("../schema/schema.js");

exports.fetchAllUsers = async () => {
  const users = await userModel.find({})
  try {
        return users
      } catch (error) {
        return error
      }
}