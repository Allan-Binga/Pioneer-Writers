const client = require("../config/dbConfig");

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

// Get writers a client has worked with
const getMyWriters = async (req, res) => {
  const clientId = req.userId;

  try {
    // Fetch distinct writers from orders for this client, including average rating
    const result = await client.query(
      `
      SELECT 
        w.writer_id,
        w.full_name,
        w.phone_number,
        w.email,
        w.bio,
        w.profile_picture_url,
        w.writer_level,
        w.writer_type,
        w.is_available,
        w.completed_orders,
        w.joined_at,
        w.primary_topic_field,
        COALESCE(r.avg_rating, 0) AS average_rating,
        COALESCE(r.rating_count, 0) AS rating_count
      FROM writers w
      JOIN orders o ON o.writer_id = w.writer_id
      LEFT JOIN (
        SELECT target_writer_id, AVG(rating) AS avg_rating, COUNT(rating) AS rating_count
        FROM ratings
        GROUP BY target_writer_id
      ) r ON r.target_writer_id = w.writer_id
      WHERE o.user_id = $1
      GROUP BY w.writer_id, r.avg_rating, r.rating_count
      `,
      [clientId]
    );

    const writers = result.rows;

    return res.status(200).json({
      success: true,
      writers,
      count: writers.length,
    });
  } catch (error) {
    console.error("Error fetching writers:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch writers",
    });
  }
};

module.exports = { getWriters, getMyWriters };
