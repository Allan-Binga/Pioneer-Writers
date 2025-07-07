const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profile");
const { authUser } = require("../middleware/jwt");

const router = express.Router();

router.get("/my-profile", authUser, getProfile);
router.patch("/update-profile", authUser, updateProfile);

module.exports = router;
