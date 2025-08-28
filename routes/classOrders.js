const express = require("express")
const { postClassOrder, userClassOrders } = require("../controllers/classOrders")
const { authUser } = require("../middleware/jwt")
const { uploadedFile } = require("../middleware/upload")

const router = express.Router()

router.post("/post-class-order", authUser, uploadedFile.array('uploadedFiles', 5) , postClassOrder)
router.get("/my-classes", authUser, userClassOrders)

module.exports = router