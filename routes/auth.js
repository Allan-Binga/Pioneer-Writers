const express = require("express");
const {
  signUp,
  signIn,
  signOut,
  signUpAdmin,
  signInAdmin,
  signOutAdmin,
  signUpWriter,
  signInWriter,
  signOutWriter,
} = require("../controllers/auth");

const router = express.Router();

//Users
router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", signOut);

//Administrators
router.post("/administrator/sign-up", signUpAdmin);
router.post("/administrator/sign-in", signInAdmin);
router.post("/administrator/sign-out", signOutAdmin);

//Writers
router.post("/writer/sign-up", signUpWriter);
router.post("/writer/sign-in", signInWriter);
router.post("/writer/sign-out", signOutWriter);

module.exports = router;
