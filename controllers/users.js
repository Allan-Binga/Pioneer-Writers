const client = require("../config/dbConfig");

//Get Users
const getUsers = async (req, res) => {
  try {
    const users = await client.query("SELECT * FROM users");
    res.status(200).json(users.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users." });
  }
};

module.exports = {getUsers};
