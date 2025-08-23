const client = require("../config/dbConfig");

// Rate Writer
const rateWriter = async (req, res) => {
  const clientId = req.userId; // logged-in client
  const { writerId } = req.params;
  const { order_id, rating, comment } = req.body;

  try {
    // validate rating range (example: 1–5)
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5." });
    }

    const newRating = await client.query(
      `INSERT INTO ratings (rater_id, target_writer_id, order_id, rating, comment, rater_type)
       VALUES ($1, $2, $3, $4, $5, 'client')
       RETURNING *`,
      [clientId, writerId, order_id, rating, comment]
    );

    res.status(201).json({
      message: "Writer rated successfully",
      rating: newRating.rows[0],
    });
  } catch (error) {
    console.error("Error rating writer:", error);
    res.status(500).json({ message: "Server error while rating writer" });
  }
};

//Rate Client
const rateClient = async (req, res) => {
  const writerId = req.writerId;
  const { clientId } = req.params;
  const { order_id, rating, comment } = req.body;

  try {
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5." });
    }

    const newRating = await client.query(
      `INSERT INTO ratings (rater_id, target_user_id, order_id, rating, comment, rater_type)
       VALUES ($1, $2, $3, $4, $5, 'writer')
       RETURNING *`,
      [writerId, clientId, order_id, rating, comment]
    );

    res.status(201).json({
      message: "Client rated successfully",
      rating: newRating.rows[0],
    });
  } catch (error) {
    console.error("Error rating client:", error);
    res.status(500).json({ message: "Server error while rating client" });
  }
};

// Fetch Writer Rating
const getWriterRatings = async (req, res) => {
  try {
    const { writerId } = req.params;

    let query;
    let params = [];

    if (req.user.role === "Writer") {
      // Writers can only view their own ratings
      if (req.user.id !== writerId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      query = `
        SELECT 
          COALESCE(AVG(rating), 0) AS average_rating,
          COUNT(rating) AS rating_count
        FROM ratings
        WHERE target_writer_id = $1
      `;
      params = [writerId];
    } else if (req.user.role === "Admin") {
      // Admins can view any writer's ratings
      query = `
        SELECT 
          COALESCE(AVG(rating), 0) AS average_rating,
          COUNT(rating) AS rating_count
        FROM ratings
        WHERE target_writer_id = $1
      `;
      params = [writerId];
    } else if (req.user.role === "Client") {
      // Clients can view any writer's ratings
      query = `
        SELECT 
          COALESCE(AVG(rating), 0) AS average_rating,
          COUNT(rating) AS rating_count
        FROM ratings
        WHERE target_writer_id = $1
      `;
      params = [writerId];
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const result = await client.query(query, params);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching writer ratings:", error);
    res.status(500).json({ message: "Failed to fetch writer ratings." });
  }
};

// Fetch Client Rating
const getClientRatings = async (req, res) => {
  try {
    const { clientId } = req.params;
    let query;
    let params = [];

    if (req.user.role === "Client") {
      // Clients can only view their own ratings
      if (req.user.id !== clientId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      query = `
        SELECT 
          COALESCE(AVG(rating), 0) AS average_rating,
          COUNT(rating) AS rating_count
        FROM ratings
        WHERE target_user_id = $1
      `;
      params = [clientId];
    } else if (req.user.role === "Admin") {
      // Admins can view any client's ratings
      query = `
        SELECT 
          COALESCE(AVG(rating), 0) AS average_rating,
          COUNT(rating) AS rating_count
        FROM ratings
        WHERE target_user_id = $1
      `;
      params = [clientId];
    } else if (req.user.role === "Writer") {
      // Writers can view any client's ratings
      query = `
        SELECT 
          COALESCE(AVG(rating), 0) AS average_rating,
          COUNT(rating) AS rating_count
        FROM ratings
        WHERE target_user_id = $1
      `;
      params = [clientId];
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const result = await client.query(query, params);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching client ratings:", error);
    res.status(500).json({ message: "Failed to fetch client ratings." });
  }
};

module.exports = { rateWriter, rateClient, getWriterRatings, getClientRatings };
