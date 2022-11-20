const multer = require("multer");
const { S3Client } = require('@aws-sdk/client-s3')
const multerS3 = require('multer-s3')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./db/uploads");
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now());
    },
  });
  
const upload = multer({ storage: storage });

const s3 = new S3Client()

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname + "-" + Date.now()});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

module.exports = {upload, uploadS3};