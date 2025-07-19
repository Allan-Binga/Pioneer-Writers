const express = require("express")
const { signUp, signIn , signOut, signUpAdmin, signInAdmin, signOutAdmin} = require("../controllers/auth")

const router = express.Router()

//Users
router.post("/sign-up", signUp)
router.post("/sign-in", signIn)
router.post("/sign-out", signOut)

//Administrators
router.post("/administrator/sign-up", signUpAdmin)
router.post("/administrator/sign-in", signInAdmin)
router.post("/administrator/sign-out", signOutAdmin)

module.exports = router