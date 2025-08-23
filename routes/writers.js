const express = require("express")
const { getWriters, getMyWriters } = require("../controllers/writers")
const { authUser } = require("../middleware/jwt")

const router = express.Router()

router.get("/all", getWriters)
router.get("/my-writers", authUser, getMyWriters)

module.exports = router