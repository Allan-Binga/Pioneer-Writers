const express = require("express");
const { createNews, getNews } = require("../controllers/news");
const { authAdmin, authUserOrAdmin, authAnyRole } = require("../middleware/jwt");

const router = express.Router();

router.post("/post-news", authAdmin, createNews);
router.get("/fetch-news", authAnyRole, getNews);

module.exports = router;
