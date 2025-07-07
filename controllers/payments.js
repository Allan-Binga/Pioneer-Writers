const client = require("../config/dbConfig");

// Fetch Payments
const getMyPayments = async (req, res) => {
  const userId = req.userId;

  try {
    const payments = await client.query(
      `SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    res.status(200).json(payments.rows);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

module.exports = { getMyPayments };
