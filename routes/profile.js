const express = require("express");
const { getProfile, updateProfile, getAdminProfile } = require("../controllers/profile");
const { authUser, authAdmin } = require("../middleware/jwt");
const {uploadedFile} = require("../middleware/upload")

const router = express.Router();

router.get("/my-profile", authUser, getProfile);
router.get("/admin-profile", authAdmin, getAdminProfile)
router.patch("/update-profile", authUser, uploadedFile.array('avatar', 1), updateProfile);

module.exports = router;
