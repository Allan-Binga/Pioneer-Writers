const express = require("express")
const { postOrder, getOrders, getUsersOrders, updateOrder, deleteOrder} = require("../controllers/orders")
const {authUser} = require("../middleware/jwt")
const {uploadedFile} = require("../middleware/upload")

const router = express.Router()

router.post("/post-order",authUser,uploadedFile.array('uploadedFiles', 20),postOrder);
router.get("/all/orders", getOrders)
router.get("/my-orders", getUsersOrders)
router.patch("/update-order/:orderId", authUser, uploadedFile.array(), updateOrder)
router.delete("/delete-order/:orderId", authUser, deleteOrder)

module.exports = router