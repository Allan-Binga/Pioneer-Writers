const express = require("express");
const { getMyPayments, capturePayment } = require("../controllers/payments");
const { authUser } = require("../middleware/jwt");

const router = express.Router();

router.get("/all/my-payments", authUser, getMyPayments);
router.post("/capture", authUser, capturePayment)

module.exports = router;
