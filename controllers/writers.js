const client = require("../config/dbConfig");

//Get Writers
const getWriters = async (req, res) => {
  try {
    const writers = await client.query(`SELECT * FROM writers`);
    res.status(200).json(writers.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

module.exports = { getWriters };
