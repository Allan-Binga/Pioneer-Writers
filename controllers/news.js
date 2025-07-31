const client = require("../config/dbConfig");

//Create News
const createNews = async (req, res) => {
  const { title, body, date } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: "Title and body are required." });
  }

  try {
    const result = await client.query(
      `INSERT INTO news (title, body, date) VALUES ($1, $2, $3) RETURNING *`,
      [title, body, date || new Date()]
    );

    res.status(201).json({
      message: "News posted successfully.",
      news: result.rows[0],
    });
  } catch (error) {
    console.error("Error posting news:", error);
    res.status(500).json({ message: "Failed to post news." });
  }
};

//Fetch News
const getNews = async (req, res) => {
  try {
    const news = await client.query("SELECT * FROM news");
    res.status(200).json(news.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch news." });
  }
};

module.exports = { createNews, getNews };
