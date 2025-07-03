const express = require("express")
const {createDraft, getDrafts, deleteDrafts} = require("../controllers/drafts")

const router = express.Router()

//Routes
router.post("/new-draft", createDraft)
router.get("/", getDrafts)
router.delete("/delete-drafts", deleteDrafts)

module.exports = router