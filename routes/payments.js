const express = require("express")
const { getPayments, makePayment } = require("../controllers/payments")

const router = express.Router()

router.get("/get-payments", getPayments)
router.post("/make-payment", makePayment)

module.exports = router