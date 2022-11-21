const {
  fetchAllContainers,
  postContainer,
  fetchContainerById,
  fetchAllRooms,
  postContainerWithParentId, updateContainerById, pushArrayIntoParentContainer, deleteItemFromContainer,
  deleteContainerById
} = require("../models/containers-model");
const { fetchImageById,postBufferedImage, deleteImageById  } = require("../models/images-model");
const sharp = require ("sharp")
const {resizeBufferedImage} = require("../db/upload.js")

exports.getAllContainers = (req, res, next) => {
  fetchAllContainers()
    .then((containers) => {
      //console.log(containers);
      res.status(200).send(containers);
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
      //console.log(container);
      res.status(200).send(container);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getContainerById = (req, res, next) => {
  //console.log("Inside of getcontainerbyid")
  const { id } = req.params;
  fetchContainerById(id)
    .then((container) => {
      // console.log("Container found: ", container)
      fetchImageById(container.image).then((image) => {

        if (container.contains.length===0){
          res.send(container)
        }
        container.image = image.img;

        //console.log("Image found:", image)

        const containsArray = [];

        let containsArrayCount = 0;

        container.contains.map((containerId) => {
          //console.log("Container Id:", containerId)

          if (typeof containerId === "string") {
            //console.log("Is a string")

            getNestedContainerById(containerId).then((nestedContainer) => {
              containsArrayCount++;

              containsArray.push(nestedContainer);

              //console.log("Size of containsArrayCount: ", containsArrayCount)

              if (containsArrayCount === container.contains.length) {
                //console.log("containersArray length", containsArray.length)

                let imageCounter = 0;

                //console.log("ENd of first mapping of containers")

                containsArray.map((element, index) => {
                  fetchImageById(element.image).then((image) => {
                    imageCounter++;

                    containsArray[index].image = image.img;

                    if (imageCounter === containsArray.length) {
                      //console.log("ENd of images mapping")

                      container.contains = containsArray;
                      //console.log(container, "<---------------------------")
                      res.status(200).send(container);
                    }
                  });
                });
              }
            });
          } else {
            containsArrayCount++;

            //console.log("Is an object")

            containsArray.push(containerId);

            //console.log("containsArrayCount: ", containsArrayCount)

            if (containsArrayCount === container.contains.length) {
              // console.log("containersArray length", containsArray.length)

              let imageCounter = 0;

              //console.log("ENd of first mapping of containers")

              containsArray.map((element, index) => {
                fetchImageById(element.image).then((image) => {
                  imageCounter++;

                  containsArray[index].image = image.img;

                  if (imageCounter === containsArray.length) {
                    //console.log("ENd of images mapping")

                    container.contains = containsArray;
                    //console.log(container, "<---------------------------")
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

  const containerName = req.body.name
  const containerDescription =  req.body.description
  const containerParentId = req.params.parent_id

  resizeBufferedImage(req.file.buffer).then((resized) => {

    postBufferedImage(containerName, resized.buffer).then((imageId)=>{

      postContainerWithParentId(containerName, containerDescription, containerParentId, imageId).then((container_id)=>{

        res.send(`new container created: ${container_id}`);

      })

    })

  });
};

exports.removeContainer = (req, res, next)=>{

  const { container_id } = req.params
  console.log(container_id)

  let containsArray = []

  return fetchContainerById(container_id).then((container) => {

    console.log(container)

    containsArray = [...container.contains]

    console.log("containsArray: ", containsArray)
    console.log("Parent id: ", container.parent_id)

    return pushArrayIntoParentContainer(container.parent_id, containsArray, container_id).then((parent_id)=>{

      deleteContainerById(container_id).then((container_id)=>{

        deleteImageById(container.image).then((image_id)=>{

          res.send(`Container ${container_id} removed!!`)
        }).catch(() => res.status(404).send("Unable to delete image"))
      }).catch(()=>{
        res.status(404).send("Unable to delete container")
      })
    }).catch(()=>{
      res.status(404).send("Unable to push items to parent container")
    })



  }).catch(()=>{

    res.status(404).send("Container doesn't exist")

  })




}