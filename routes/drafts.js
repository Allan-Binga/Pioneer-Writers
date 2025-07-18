const express = require("express")
const { getDrafts, deleteDrafts, updateDraft} = require("../controllers/drafts")
const {authUser} = require("../middleware/jwt")
const {uploadedFile} = require("../middleware/upload")

const router = express.Router()

//Routes
router.get("/", getDrafts)
router.delete("/delete-drafts", authUser, deleteDrafts)
router.patch("/update-draft", authUser, uploadedFile.array(), updateDraft)

module.exports = router