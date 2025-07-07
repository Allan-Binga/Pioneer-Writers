const express = require("express");
const { sendMessageToWriter, getMyMessages } = require("../controllers/inbox");
const { authUser } = require("../middleware/jwt");
const { uploadedFile } = require("../middleware/upload");

const router = express.Router();

router.post("/send/email/writer", authUser, sendMessageToWriter);
router.get("/messages/all", authUser, getMyMessages);

module.exports = router;
