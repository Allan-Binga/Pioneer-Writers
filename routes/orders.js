const express = require("express")
const { postOrder, getOrders } = require("../controllers/orders")
const {authUser} = require("../middleware/jwt")
const {uploadedFile} = require("../middleware/upload")

const router = express.Router()

router.post("/post-order", authUser, uploadedFile.single('uploadedFile'), postOrder)
router.get("/orders", getOrders)

module.exports = router