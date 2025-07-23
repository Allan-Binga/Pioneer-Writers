const express = require("express");
const { getProfile, updateProfile, getAdminProfile } = require("../controllers/profile");
const { authUser, authAdmin } = require("../middleware/jwt");

const router = express.Router();

router.get("/my-profile", authUser, getProfile);
router.get("/admin-profile", authAdmin, getAdminProfile)
router.patch("/update-profile", authUser, updateProfile);

module.exports = router;
