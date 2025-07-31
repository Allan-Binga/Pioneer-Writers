const express = require("express")
const { resetPasswordEmail, resetPasswordToken, verifyPasswordResetToken } = require("../controllers/password")

const router = express.Router()

router.post("/send/password-reset-email", resetPasswordEmail)
router.get("/verify/password/reset-token", verifyPasswordResetToken)
router.put("/reset/password/token", resetPasswordToken)


module.exports = router