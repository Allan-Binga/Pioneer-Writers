const client = require("../config/dbConfig");

//Get Writers
// Get Writers (with optional primary_topic_field filter)
const getWriters = async (req, res) => {
  const { field } = req.query;

  try {
    let query;
    let params = [];

    if (field) {
      query = `SELECT * FROM writers WHERE primary_topic_field = $1`;
      params = [field];
    } else {
      query = `SELECT * FROM writers`;
    }

    const writers = await client.query(query, params);
    res.status(200).json(writers.rows);
  } catch (error) {
    console.error("Error fetching writers:", error);
    res.status(500).json({ message: "Failed to fetch writers." });
  }
};

module.exports = { getWriters };
