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

 // console.log("Inside of getcontainerbyid")
  const { id } = req.params;
  fetchContainerById(id)
    .then((container) => {
     // console.log("Container found: ", container)
      fetchImageById(container.image).then((image) => {

        container.image = image.img;

        //console.log("Image found:", image)

        const containsArray = []

        let containsArrayCount=0

        container.contains.map((containerId) => {

          //console.log("Container Id:", containerId)

          

          if (typeof containerId === "string") {

            //console.log("Is a string")
            getNestedContainerById(containerId).then((nestedContainer) => {

              containsArrayCount++

              containsArray.push(nestedContainer)
  
              if (containsArray.length === container.contains.length){

                //console.log("containersArray length", containsArray.length)

                let imageCounter = 0

                //console.log("ENd of first mapping of containers")

                containsArray.map((element, index) => {
                  
                  fetchImageById(element.image).then((image) => {

                    imageCounter ++

                    containsArray[index].image = image.img

                    if (imageCounter===containsArray.length){

                      //console.log("ENd of images mapping")

                      container.contains = containsArray
                      //console.log(container, "<---------------------------")
                      res.status(200).send(container);

                    }
                  })
                  
                })
                
              }
            })
          } else {

            containsArrayCount++

            //console.log("Is an object")

            containsArray.push(containerId)

            //console.log("containsArrayCount: ", containsArrayCount)

            if (containsArrayCount === container.contains.length){

             // console.log("containersArray length", containsArray.length)

              let imageCounter = 0

              //console.log("ENd of first mapping of containers")

              containsArray.map((element, index) => {
                
                fetchImageById(element.image).then((image) => {

                  imageCounter ++

                  containsArray[index].image = image.img

                  if (imageCounter===containsArray.length){

                    //console.log("ENd of images mapping")

                    container.contains = containsArray
                    //console.log(container, "<---------------------------")
                    res.status(200).send(container);

                  }
                })
                
              })
              
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
