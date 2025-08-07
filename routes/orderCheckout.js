const express = require("express");
const { paypalCheckout, stripeCheckout, cancelPaypalCheckout} = require("../controllers/orderCheckout");
const { authUser } = require("../middleware/jwt");

const router = express.Router();

router.post("/pay-with-paypal", authUser, paypalCheckout);
router.post("/cancel/paypal-payment", authUser, cancelPaypalCheckout)
router.post("/stripe", authUser, stripeCheckout)

module.exports = router;
