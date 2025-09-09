const express = require("express")
const { authWriter } = require("../middleware/jwt")
const { fetchAllPayments, fetchMaturedPayouts, withdrawPayouts, recentPayouts, addPayoutAccount } = require("../controllers/writerPayments")

const router = express.Router()

router.get("/payouts", authWriter, fetchAllPayments)
router.post("/payouts/add/payout-account", authWriter, addPayoutAccount)
router.get("/payouts/available", authWriter, fetchMaturedPayouts)
router.get("/payouts/recent", authWriter, recentPayouts)
router.post("/payouts/release-funds", authWriter, withdrawPayouts)

module.exports = router