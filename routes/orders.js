const express = require("express")
const { postOrder, getOrders, getUsersOrders, updateOrder, deleteOrder, getSingleOrder, getAdminSingleOrder, getWritersOrders, getPublicOrderDetails, submitAssignment, completeOrder, disputeOrder} = require("../controllers/orders")
const { getDashboard } = require("../controllers/dashboard")
const {authUser, authAdmin, authAnyRole, authWriter} = require("../middleware/jwt")
const {uploadedFile} = require("../middleware/upload")

const router = express.Router()

router.post("/post-order",authUser,uploadedFile.array('uploadedFiles', 20),postOrder);
router.get("/all/orders", authAnyRole, getOrders)
router.get("/dashboard-details",authUser, getDashboard )
router.get("/order/:orderId", authAnyRole, getSingleOrder)
router.get("/public/:orderId", authWriter, getPublicOrderDetails)
router.get("/administrator/order/:orderId", authAdmin, getAdminSingleOrder)
router.get("/my-orders", authUser,getUsersOrders)
router.get("/writer/my-orders", authWriter, getWritersOrders)
router.post("/submit-assignment/:orderId", authWriter, uploadedFile.array('uploadedFiles', 5), submitAssignment)
router.post("/order/complete/:orderId", authUser, completeOrder)
router.post("/order/dispute/:orderId", authUser, uploadedFile.array('disputeFiles', 5), disputeOrder)
router.patch("/update-order/:orderId",  authUser, updateOrder)
router.delete("/delete-order/:orderId", authUser, deleteOrder)

module.exports = router