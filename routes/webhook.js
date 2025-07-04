const express = require("express")
const { handlePaypalWebhook, handleStripeWebhook } = require("../controllers/webhook")

const router = express.Router()

router.post("/paypal", handlePaypalWebhook)
router.post("/stripe", handleStripeWebhook)

module.exports = router