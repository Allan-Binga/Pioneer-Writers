const express = require("express")
const { postOrder, getOrders, getUsersOrders, updateOrder, deleteOrder, getSingleOrder} = require("../controllers/orders")
const { getDashboard } = require("../controllers/dashboard")
const {authUser} = require("../middleware/jwt")
const {uploadedFile} = require("../middleware/upload")

const router = express.Router()

router.post("/post-order",authUser,uploadedFile.array('uploadedFiles', 20),postOrder);
router.get("/all/orders", getOrders)
router.get("/dashboard-details",authUser, getDashboard )
router.get("/order/:orderId", authUser, getSingleOrder)
router.get("/my-orders", authUser,getUsersOrders)
router.patch("/update-order/:orderId", authUser, uploadedFile.array(), updateOrder)
router.delete("/delete-order/:orderId", authUser, deleteOrder)

module.exports = router