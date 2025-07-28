const express = require("express");
const { sendMessageToWriter, getMyMessages, administratorMessageService, getAdminMessages } = require("../controllers/emails");
const { authUser, authAdmin } = require("../middleware/jwt");
const { uploadedFile } = require("../middleware/upload");

const router = express.Router();

router.post("/send/email/writer", authUser, sendMessageToWriter);
router.get("/messages/all", authUser, getMyMessages);
router.post("/send-email/administrator", authAdmin, administratorMessageService)
router.get("/administrator/messages/all", authAdmin, getAdminMessages)

module.exports = router;
