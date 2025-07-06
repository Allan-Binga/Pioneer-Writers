const express = require("express")
const { getWriters } = require("../controllers/writers")

const router = express.Router()

router.get("/all", getWriters)

module.exports = router