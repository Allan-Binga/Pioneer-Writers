const express = require("express");
const { createNews, getNews } = require("../controllers/news");
const { authAdmin, authUserOrAdmin } = require("../middleware/jwt");

const router = express.Router();

router.post("/post-news", authAdmin, createNews);
router.get("/fetch-news", authUserOrAdmin, getNews);

module.exports = router;
