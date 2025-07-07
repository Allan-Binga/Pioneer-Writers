const express = require("express");
const { getMyPayments } = require("../controllers/payments");
const { authUser } = require("../middleware/jwt");

const router = express.Router();

router.get("/all/my-payments", authUser, getMyPayments);

module.exports = router;
