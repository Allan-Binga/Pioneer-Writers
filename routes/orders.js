const express = require("express")
const { postOrder, getOrders, getUsersOrders } = require("../controllers/orders")
const {authUser} = require("../middleware/jwt")
const {uploadedFile} = require("../middleware/upload")

const router = express.Router()

router.post("/post-order", authUser, uploadedFile.single('uploadedFile'), postOrder)
router.get("/all/orders", getOrders)
router.get("/my-orders", getUsersOrders)

module.exports = router