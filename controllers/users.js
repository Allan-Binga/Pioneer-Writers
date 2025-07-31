const client = require("../config/dbConfig");

//Get Users/Clients
const getUsers = async (req, res) => {
  try {
    const users = await client.query("SELECT * FROM users");
    res.status(200).json(users.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users." });
  }
};

//Fetch Single User
const getSingleUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user
    const userResult = await client.query(
      "SELECT * FROM users WHERE user_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = userResult.rows[0];

    // Fetch user's orders
    const ordersResult = await client.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    const orders = ordersResult.rows;

    // Respond with both
    res.status(200).json({ user, orders });
  } catch (error) {
    console.error("Error fetching user and orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Fetch Single Writer
const getSingleWriter = async (req, res) => {
  const { writerId } = req.params;

  try {
    //Fetch writer
    const writerResult = await client.query(
      "SELECT * FROM writers WHERE writer_id = $1",
      [writerId]
    );

    if (writerResult.rows.length === 0) {
      return res.status(404).json({ message: "Writer not found." });
    }

    const writer = writerResult.rows[0];

    // Fetch user's orders
    const ordersResult = await client.query(
      "SELECT * FROM orders WHERE writer_id = $1 ORDER BY created_at DESC",
      [writerId]
    );

    const orders = ordersResult.rows;

    // Respond with both
    res.status(200).json({ writer, orders });
  } catch (error) {
    console.error("Error fetching writer and orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Get Writers
const getWriters = async (req, res) => {
  try {
    const writers = await client.query("SELECT * FROM writers");
    res.status(200).json(writers.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch writers." });
  }
};

//Get Administrators
const getAdmins = async (req, res) => {
  try {
    const admins = await client.query("SELECT * FROM administrators");
    res.status(200).json(admins.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch administrators." });
  }
};

module.exports = {
  getUsers,
  getWriters,
  getSingleWriter,
  getAdmins,
  getSingleUser,
};
