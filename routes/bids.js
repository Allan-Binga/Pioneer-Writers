const express = require("express")
const { placeBid, getBids, assignWriter, removeBid, getBidsForOrder } = require("../controllers/bids")
const { authWriter, authUser, authAnyRole } = require("../middleware/jwt")

const router = express.Router()

router.post("/place-bid",authWriter, placeBid)
router.delete("/remove-bid/:orderId", authWriter, removeBid)
router.get("/all-bids", authAnyRole, getBids)
router.get("/order/:orderId", authUser, getBidsForOrder)
router.post("/assign-writer/:bidId", authUser, assignWriter)

module.exports = router