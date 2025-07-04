const express = require("express");
const { paypalCheckout } = require("../controllers/orderCheckout");
const { authUser } = require("../middleware/jwt");

const router = express.Router();

router.post("/pay-with-paypal", authUser, paypalCheckout);

module.exports = router;
