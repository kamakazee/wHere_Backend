const {
  fetchAllContainers,
  postContainer,
  fetchContainerById,
} = require("../models/containers-model");
const { fetchImageById } = require("../models/images-model");

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
  const { id } = req.params;
  fetchContainerById(id)
    .then((container) => {
      fetchImageById(container.image).then((image) => {

        container.image = image.img;

        const containsArray = []

        container.contains.map((containerId) => {

          //console.log("containerid: ", containerId)

          if (typeof containerId === "string") {
            getNestedContainerById(containerId).then((nestedContainer) => {

              containsArray.push(nestedContainer)
              
              if (containsArray.length === container.contains.length){

                let imageCounter = 0

                containsArray.map((element, index) => {
                  
                  fetchImageById(element.image).then((image) => {

                    imageCounter ++

                    containsArray[index].image = image.img

                    if (imageCounter===containsArray.length){

                      container.contains = containsArray
                      //console.log(container, "<---------------------------")
                      res.status(200).send(container);

                    }
                    
        
                  })
                  
                })
                
              }
            })
          } else {
            containsArray.push(containerId)
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
