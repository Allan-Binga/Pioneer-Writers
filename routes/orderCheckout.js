const express = require("express")
const { paypalCheckout } = require("../controllers/orderCheckout")

const router = express.Router()

router.post("/pay-with-paypal", paypalCheckout)

module.exports = router