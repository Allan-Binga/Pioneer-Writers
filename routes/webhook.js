const express = require("express")
const { handlePaypalWebhook } = require("../controllers/webhook")

const router = express.Router()

router.post("/paypal", handlePaypalWebhook)

module.exports = router