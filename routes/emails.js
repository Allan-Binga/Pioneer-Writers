const express = require("express");
const { sendMessageToWriter, getMyMessages, administratorMessageService, getAdminMessages, getWriterMessages, writerReadOrTrash, sendMessageToClient, userReadTrashOrArchive } = require("../controllers/emails");
const { authUser, authAdmin, authWriter } = require("../middleware/jwt");
const { uploadedFile } = require("../middleware/upload");

const router = express.Router();

router.post("/send/email/writer", authUser, sendMessageToWriter);
router.post("/writer/send/email/client", authWriter, sendMessageToClient)
router.get("/messages/all", authUser, getMyMessages);
router.patch("/user/read/archive/trash/:id", authUser, userReadTrashOrArchive)
router.get("/writer/messages/all", authWriter, getWriterMessages)
router.patch("/writer/read-or-trash/:id", authWriter, writerReadOrTrash)
router.post("/send-email/administrator", authAdmin, administratorMessageService)
router.get("/administrator/messages/all", authAdmin, getAdminMessages)

module.exports = router;
