const {
  userModel
} = require("../schema/schema.js");

exports.fetchAllUsers = async () => {
  try {
    const users = await userModel.find({});
    return users;
  } catch (error) {
    return error;
  }
};

exports.postNewUser = async (userBody) => {
  const user = new userModel(userBody);

  try {
    await user.save();
    return user;
  } catch (error) {
    response.status(500).send(error);
  }
};
