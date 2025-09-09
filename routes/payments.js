const express = require("express");
const { getMyPayments, capturePayment, getAllPayments, captureClassHelpPayment, getClassPayments } = require("../controllers/payments");
const { authUser, authAdmin } = require("../middleware/jwt");

const router = express.Router();

router.get("/all/my-payments", authUser, getMyPayments);
router.get("/all/class/my-payments", authUser, getClassPayments)
router.post("/capture", authUser, capturePayment)
router.post("/capture/class", authUser, captureClassHelpPayment)
router.get("/administrator/all-payments", authAdmin, getAllPayments)

module.exports = router;
