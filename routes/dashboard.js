const express = require("express")
const { getDashboard, getAdminDashboard } = require("../controllers/dashboard")
const { authAdmin, authUser } = require("../middleware/jwt")

const router = express.Router()

router.get("/user/dashboard", authUser, getDashboard)
router.get("/administrator/dashboard", authAdmin, getAdminDashboard)

module.exports = router