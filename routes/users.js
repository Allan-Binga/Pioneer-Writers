const express = require("express");
const { getUsers, getWriters, getAdmins, getSingleUser, getSingleWriter } = require("../controllers/users");
const { authAdmin } = require("../middleware/jwt");

const router = express.Router();

router.get("/clients", authAdmin, getUsers);
router.get("/clients/:userId", authAdmin, getSingleUser)
router.get("/writers", authAdmin, getWriters);
router.get("/writers/:writerId", authAdmin, getSingleWriter)
router.get("/administrators", authAdmin, getAdmins);

module.exports = router;
