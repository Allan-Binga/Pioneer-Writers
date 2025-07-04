const express = require("express");
const { paypalCheckout, stripeCheckout } = require("../controllers/orderCheckout");
const { authUser } = require("../middleware/jwt");

const router = express.Router();

router.post("/pay-with-paypal", authUser, paypalCheckout);
router.post("/stripe/pay-with-googlepay", authUser, stripeCheckout)

module.exports = router;
