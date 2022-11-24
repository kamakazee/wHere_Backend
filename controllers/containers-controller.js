const {
  fetchAllContainers,
  postContainer,
  fetchContainerById,
  fetchAllRooms,
  postContainerWithParentId,
  pushArrayIntoParentContainer,
  deleteContainerById,
  patchContainer,
  getContainerNameById,
  getParentIds
} = require("../models/containers-model");
const {
  fetchImageById,
  postBufferedImage,
  deleteImageById,
} = require("../models/images-model");
const sharp = require("sharp");
const { resizeBufferedImage } = require("../db/upload.js");

const recursiveContainerCall = async (parent_id, resultArray)=>{

  if(parent_id.length>0){

    return fetchContainerById(parent_id).then((container)=>{

      //console.log("Parent found:", container.name)
      if(container.parent_id.length>0){
      resultArray.push(container.parent_id)
      }
      
      return recursiveContainerCall(container.parent_id, resultArray)
    })
  }else{
    console.log("Done")
    return resultArray
  }
}

exports.getAllContainers = (req, res, next) => {
  fetchAllContainers()
    .then((containers) => {
      //console.log("containers: ", containers)

      let containerCount = 0;

      containers.forEach((container, index) => {
        // console.log("At this container:", container)
        // console.log("Keys of object", Object.keys(container._doc))

        if (
          container._doc.hasOwnProperty("parent_id") &&
          container._doc.parent_id.length>0) {
          getContainerNameById(container.parent_id).then((parentName) => {
            console.log("At this index", index);
            console.log(parentName, "<==== parent name");

            containerCount++;

            // console.log("count", containerCount)

            containers[index]._doc.parent_name = parentName;

            console.log(containers[index]._doc.parent_name, "inside of array");

            console.log(
              "Keys inside of container",
              Object.keys(containers[index]._doc)
            );

            console.log(containers[index], "container inside of array");

            if (containerCount === containers.length - 1) {

              let containerCount = 0

                containers.forEach((container, index)=>{

                  console.log("Container count", containerCount)

                  if(container.parent_id.length>0){

                  const parentsArray = []
                  parentsArray.push(container.parent_id)

                  recursiveContainerCall(container.parent_id, parentsArray ).then((resultsArray)=>{

                    containerCount++

                    console.log("parents Array", resultsArray)

                    containers[index]._doc.parents_array = resultsArray
                    console.log("ContainerCount:", containerCount)

                    if(containerCount===containers.length-1){

                      res.status(200).send(containers);

                    }


                  })

                }



                })

              
              

              // })


            }
          });
        }
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getRooms = (req, res, next) => {
  fetchAllRooms()
    .then((rooms) => {
      res.status(200).send(rooms);
    })
    .catch((err) => {
      next(err);
    });
};

exports.addContainer = (req, res, next) => {
  postContainer(req.body)
    .then((container) => {
      res.status(200).send(container);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getContainerById = (req, res, next) => {
  const { id } = req.params;
  fetchContainerById(id)
    .then((container) => {
      fetchImageById(container.image).then((image) => {
        if (container.contains.length === 0) {
          res.send(container);
        }
        container.image = image.img;

        const containsArray = [];

        let containsArrayCount = 0;

        container.contains.map((containerId) => {
          if (typeof containerId === "string") {
            getNestedContainerById(containerId).then((nestedContainer) => {
              containsArrayCount++;

              containsArray.push(nestedContainer);

              if (containsArrayCount === container.contains.length) {
                let imageCounter = 0;

                containsArray.map((element, index) => {
                  fetchImageById(element.image).then((image) => {
                    imageCounter++;

                    containsArray[index].image = image.img;

                    if (imageCounter === containsArray.length) {
                      container.contains = containsArray;

                      res.status(200).send(container);
                    }
                  });
                });
              }
            });
          } else {
            containsArrayCount++;

            containsArray.push(containerId);

            if (containsArrayCount === container.contains.length) {
              let imageCounter = 0;

              containsArray.map((element, index) => {
                fetchImageById(element.image).then((image) => {
                  imageCounter++;

                  containsArray[index].image = image.img;

                  if (imageCounter === containsArray.length) {
                    container.contains = containsArray;

                    res.status(200).send(container);
                  }
                });
              });
            }
          }
        });
      });
    })
    .catch((err) => {
      next(err);
    });
};

const getNestedContainerById = (id) => {
  return fetchContainerById(id)
    .then((container) => {
      return container;
    })
    .catch((err) => {
      next(err);
    });
};

exports.addNewContainer = (req, res, next) => {
  const containerName = req.body.name;
  const containerDescription = req.body.description;
  const containerParentId = req.params.parent_id;

  resizeBufferedImage(req.file.buffer).then((resized) => {
    postBufferedImage(containerName, resized.buffer).then((imageId) => {
      postContainerWithParentId(
        containerName,
        containerDescription,
        containerParentId,
        imageId
      ).then((container_id) => {
        res.send(`new container created: ${container_id}`);
      });
    });
  });
};

exports.removeContainer = (req, res, next) => {
  const { container_id } = req.params;
  console.log(container_id);

  let containsArray = [];

  return fetchContainerById(container_id)
    .then((container) => {
      console.log(container);

      containsArray = [...container.contains];

      console.log("containsArray: ", containsArray);
      console.log("Parent id: ", container.parent_id);

      return pushArrayIntoParentContainer(
        container.parent_id,
        containsArray,
        container_id
      )
        .then((parent_id) => {
          deleteContainerById(container_id)
            .then((container_id) => {
              deleteImageById(container.image)
                .then((image_id) => {
                  res.send(`Container ${container_id} removed!!`);
                })
                .catch(() => res.status(404).send("Unable to delete image"));
            })
            .catch(() => {
              res.status(404).send("Unable to delete container");
            });
        })
        .catch(() => {
          res.status(404).send("Unable to push items to parent container");
        });
    })
    .catch(() => {
      res.status(404).send("Container doesn't exist");
    });
};

exports.editContainer = (req, res, next) => {
  const { container_id } = req.params;
  const name = req.body.name;
  const desc = req.body.description;
  const parentId = req.body.parent_id;

  patchContainer(container_id, name, desc, parentId).then(() => {
    res.status(200).send("Container edited");
  });
};


exports.getAllItemsFromContainers = (req, res, next) => {

  const itemsArray = []

  fetchAllContainers().then((containers)=>{
    containers.map((container) => {

      for (let i = 0; i < container.contains.length; i++) {

        if (typeof container.contains[i]==="object") {

          itemsArray.push(container.contains[i])
         
        }
      }    
    })

    let itemCount = 0

    itemsArray.forEach((item, index)=>{

      getContainerNameById(item.parent_id).then((parentName)=>{

        console.log("parent name", parentName)

        console.log("item keys", Object.keys( itemsArray[index]))

        itemCount++

      

        itemsArray[index]["parent_name"] = parentName

        console.log("docs", itemsArray[index])

        if(itemCount===itemsArray.length){

          res.send(itemsArray)
 
        }
      })
    })
  })

  // fetchAllItemsFromContainers().then(() => {
  //   res.status(200).send("All items")
  // })
}


exports.fetchContainerNameById = (req, res, next)=>{

  const {container_id} = req.params

  getContainerNameById(container_id).then((name)=>{

    res.status(200).send(name)
  })


}




exports.getContainerLocationById = (req, res, next)=>{

  console.log("Inside gte location")

  const {container_id} = req.params

  recursiveContainerCall(container_id, []).then((resultArray)=>{

    console.log("Result Array", resultArray)

    res.send(resultArray)
  })


}