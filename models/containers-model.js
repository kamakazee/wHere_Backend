const { containerModel } = require("../schema/schema.js");
const {deleteImageById} = require ("./images-model.js")

exports.fetchAllContainers = async () => {
  try {
    const containers = await containerModel.find({});
    return containers;
  } catch (error) {
    return error;
  }
};

exports.fetchAllRooms = async () => {
  try {
    const rooms = await containerModel.find({ parent_id: "6374f23e0318fa7c71b095ed"})
    return rooms
  } catch (error) {
    return (error)
  }
}


exports.fetchContainerById = async (id) => {

  console.log("Id of container to find: ", id)

  try {
    const container = await containerModel.findById(id);

    console.log("found container: ", container)
    return container;
  } catch (error) {
    return error;
  }
};

const postContainer = async (containerBody) => {
  const container = new containerModel(containerBody);

  try {
    await container.save();
    return container;
  } catch (error) {
    return error;
  }
};

const updateContainerById = async (parent_id, container_id) => {

  try {
    await containerModel.findOneAndUpdate(
      { _id: parent_id },
      { $push: { contains: container_id.toString() } }
    );

    return container_id.toString();
  } catch (error) {
    return error
  }
};

exports.postContainerWithParentId = async (name, description, parentId, imageId)=>{


  const containerbody = {
    name: name,
    description: description,
    parent_id: parentId,
    image: imageId,
  };

  return postContainer(containerbody).then((container) => {

    return updateContainerById(parentId, container._id)

  }).then(
    (container_id) => {

      return container_id
    }
  );

}

exports.deleteItemFromContainer = async (container, item_id)=>{

  let indexOfItem = undefined
  let item ={}

      container.contains.forEach((element, index)=>{
        if (typeof element ==="object" && element._id.toString()===item_id){

          indexOfItem = index
          item = element

        }
      })

      console.log("Index of item: ", indexOfItem)

      if (indexOfItem!==undefined){

        container.contains.splice(indexOfItem,1)

        await container.save()
  
        return deleteImageById(item.image).then((imageid)=>{
  
          return item_id
  
        })

      }else{

        return Promise.reject({msg: "failed"})

      }
}

exports.pushArrayIntoParentContainer = async (parent_id, containsArray, container_id)=>{

  try {
    
    const parentContainer = await containerModel.findById(parent_id)

    if (containsArray.length > 0) {

      containsArray.forEach((element) => {
        parentContainer.contains.push(element)
      })

      let promisesArray = []

      containsArray.forEach((element, index) => {

            if (typeof element === "object") {

              containsArray[index].parent_id = parent_id
            } else {     


              promisesArray.push(updateParentContainer(element, parent_id))
            }
          })
      
      Promise.all(promisesArray).then( async (results)=>{

        let indexOfContainer = undefined

        parentContainer.contains.forEach((element, index)=>{
          if(typeof element === "string" && element === container_id){
            indexOfContainer = index
          }
        })
    
        parentContainer.contains.splice(indexOfContainer,1)
    
        await parentContainer.save()
    
        return parent_id;
        
      })

      

      // bar().then(async () => {
        
      //   console.log('All done!');

      //   let indexOfContainer = undefined

      //   parentContainer.contains.forEach((element, index) => {
      //     if (typeof element === "string" && element === container_id) {
      //       indexOfContainer = index
      //     }
      //   })
      
      //   parentContainer.contains.splice(indexOfContainer, 1)
      
      //   await parentContainer.save()

      //   return parent_id;

      // });
    } else {
      
      let indexOfContainer = undefined

      parentContainer.contains.forEach((element, index)=>{
        if(typeof element === "string" && element === container_id){
          indexOfContainer = index
        }
      })
  
      parentContainer.contains.splice(indexOfContainer,1)
  
      await parentContainer.save()
  
      return parent_id;
      
    }
  } catch (error) {
    return error
  }

}

exports.deleteContainerById = async (container_id)=>{


  try {
    await containerModel.findOneAndDelete(
      { _id: container_id }
    );

    return container_id;
  } catch (error) {
    return error
  }  
}

const updateParentContainer = async (container_id, parent_id)=>{

  console.log("Parent if to update with:" , parent_id)
  console.log("Container id to update:", container_id)

  try {
    console.log("In find one and update")

    await containerModel.findOneAndUpdate(
      { _id: container_id }, {parent_id: parent_id}
    );

    return container_id;
  } catch (error) {
    return error
  }  

}