const client = require("../config/dbConfig");

//Get Client Profile
const getProfile = async (req, res) => {
  const userId = req.userId; // From authentication middleware

  try {
    const result = await client.query(
      `SELECT user_id, username, email, avatar_url FROM users WHERE user_id = $1`,
      [userId]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//Get Admin Profile
const getAdminProfile = async (req, res) => {
  const adminId = req.adminId;

  try {
    const result = await client.query(
      `SELECT admin_id, full_name, email, phone_number, avatar_url FROM administrators WHERE admin_id = $1`,
      [adminId]
    );

    const admin = result.rows[0];

    if (!admin) {
      return res.status(404).json({ error: "Administrator not found." });
    }

    return res.status(200).json(admin);
  } catch (err) {
    console.error("Error fetching profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//Update Profile
const updateProfile = async (req, res) => {
  const userId = req.userId;
  const { username, email, phone_number } = req.body;

  try {
    // Check if tenant exists
    const checkQuery = "SELECT * FROM users WHERE user_id = $1";
    const checkResult = await client.query(checkQuery, [userId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const fields = [];
    const values = [];
    let counter = 1;

    if (username) {
      fields.push(`username = $${counter++}`);
      values.push(username);
    }

    if (email) {
      fields.push(`email = $${counter++}`);
      values.push(email);
    }

    if (phone_number) {
      fields.push(`phone_number = $${counter++}`);
      values.push(phone_number);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No data provided for update." });
    }

    const updateQuery = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE user_id = $${counter}
      RETURNING *;
    `;
    values.push(userId);

    const updateResult = await client.query(updateQuery, values);

    res.status(200).json({
      message: "User information updated successfully.",
      user: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { getProfile, updateProfile, getAdminProfile };
