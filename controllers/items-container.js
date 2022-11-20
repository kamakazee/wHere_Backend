const { fetchAllItems } = require("../models/items-model")


exports.getAllItems = (req, res, next) => {
    fetchAllItems()
    .then((allItems) => {
        res.status(200).send(allItems)
    })
    .catch((err) => {
        return err
    })
}