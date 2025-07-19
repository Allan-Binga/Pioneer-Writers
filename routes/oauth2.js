const express = require("express");
const { signInFacebook, signInGoogle, signInGoogleAdmin, signInFacebookAdmin } = require("../controllers/oauth2");

const router = express.Router();

router.post("/sign-in/google", signInGoogle);
router.post("/sign-in/facebook", signInFacebook);
router.post("/administrator/sign-in/google", signInGoogleAdmin);
router.post("/administrator/sign-in/facebook", signInFacebookAdmin);

module.exports = router;
