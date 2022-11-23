const fs = require("fs/promises");

exports.selectAPI = async ()=>{

    return fs.readFile("./endpoints.json", "utf-8").then((data) => {

        const api = JSON.parse(data)
        return api
      });



}