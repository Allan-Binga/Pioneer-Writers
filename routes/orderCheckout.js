const express = require("express");
const { paypalCheckout, stripeCheckout, handleGooglePayIntent } = require("../controllers/orderCheckout");
const { authUser } = require("../middleware/jwt");

const router = express.Router();

router.post("/pay-with-paypal", authUser, paypalCheckout);
router.post("/google", authUser, handleGooglePayIntent)
router.post("/stripe", authUser, stripeCheckout)

module.exports = router;
