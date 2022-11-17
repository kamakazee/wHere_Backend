const {
  fetchAllContainers,
  postContainer,
  fetchContainerById,
} = require("../models/containers-model");
const { fetchImageById } = require("../models/images-model");
exports.getAllContainers = (req, res, next) => {
  fetchAllContainers()
    .then((containers) => {
      console.log(containers);
      res.status(200).send(containers);
    })
    .catch((err) => {
      next(err);
    });
};

exports.addContainer = (req, res, next) => {
  postContainer(req.body)
    .then((container) => {
      console.log(container);
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

        //contains: ['container string1', 'container string2', items1, item2] <------------[containerobjects, contobject2] new array
        // ['container string1', 'container string', items1, item2, containerobjects, contobject2]

        container.contains.map((containerId) => {

          console.log("containerid: ", containerId)

          if (typeof containerId === "string") {
            getNestedContainerById(containerId).then((nestedContainer) => {
              //console.log(nestedContainer, "Nested Container top level");
              containsArray.push(nestedContainer)
              if (containsArray.length === container.contains.length){
  
                container.contains = containsArray
  
                console.log(container,"<<-------------------------------------");
  
                res.status(200).send(container);
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
