const multer = require("multer")
const multerS3 = require("multer-s3")
const AWS = require("@aws-sdk/client-s3")

require("dotenv").config()

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

//Upload files to AWS S3
const uploadedFile = multer({
    storage: multerS3({
        s3,
        bucket:process.env.AWS_S3_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const filename = `pioneer-writers/${Date.now()}-${file.originalname}`
            cb(null, filename)
        }
    })
})

module.exports = {uploadedFile}