const express = require("express");
const { getProfile, updateProfile, getAdminProfile, getWriterProfile } = require("../controllers/profile");
const { authUser, authAdmin, authWriter } = require("../middleware/jwt");
const {uploadedFile} = require("../middleware/upload")

const router = express.Router();

router.get("/client/my-profile", authUser, getProfile);
router.get("/writer/my-profile", authWriter, getWriterProfile)
router.get("/admin-profile", authAdmin, getAdminProfile)
router.patch("/update-profile", authUser, uploadedFile.array('avatar', 1), updateProfile);

module.exports = router;
