
const sharp = require ("sharp")

exports.resizeBufferedImage = async (buffer) => {

    console.log("Inside of resize3 image: ", buffer);
  
    try {
       return await sharp(buffer)
        .resize({
          width: 640,
          height: 480,
        }).toBuffer();
  
    } catch (error) {
      console.log(error);
    }
  };