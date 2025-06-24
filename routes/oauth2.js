const express = require("express");
const { signInFacebook, signInGoogle } = require("../controllers/oauth2");

const router = express.Router();

router.post("/sign-in/google", signInGoogle);
router.post("/sign-in/facebook", signInFacebook);

module.exports = router;
