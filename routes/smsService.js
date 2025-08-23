const express = require("express")
const {  clientActivateSMS, writerActivateSMS, writerDeactivateSMS, clientDeactivateSMS } = require("../controllers/smsService")
const { authWriter, authUser } = require("../middleware/jwt")

const router = express.Router()

router.post("/writer/activate-sms",authWriter, writerActivateSMS)
router.post("/client/activate-sms", authUser, clientActivateSMS)
router.post("/writer/deactivate-sms", authWriter, writerDeactivateSMS)
router.post("/client/deactivate-sms", authUser, clientDeactivateSMS)

module.exports = router