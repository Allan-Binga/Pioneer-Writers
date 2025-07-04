const express = require("express")
const { signUp, signIn , signOut} = require("../controllers/auth")

const router = express.Router()

router.post("/sign-up", signUp)
router.post("/sign-in", signIn)
router.post("/sign-out", signOut)

module.exports = router