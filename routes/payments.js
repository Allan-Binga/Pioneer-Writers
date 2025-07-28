const express = require("express");
const { getMyPayments, capturePayment, getAllPayments } = require("../controllers/payments");
const { authUser, authAdmin } = require("../middleware/jwt");

const router = express.Router();

router.get("/all/my-payments", authUser, getMyPayments);
router.post("/capture", authUser, capturePayment)
router.get("/administrator/all-payments", authAdmin, getAllPayments)

module.exports = router;
