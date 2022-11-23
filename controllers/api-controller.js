const {selectAPI} =  require("../models/api-model");

exports.getAPI = (req, res, error)=>{

    selectAPI().then((api)=>{
        res.status(200).send({api})
    })


}