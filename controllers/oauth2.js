const client = require("../config/dbConfig");
const axios = require("axios");

//Sign In with Google
const signInGoogle = async (req, res) => {
  const { token } = req.body; // from frontend

  try {
    // 1. Verify token with Google
    const googleRes = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { sub, email, userName, picture } = googleRes.data;

    // 2. Check if user exists
    const result = await client.query(
      "SELECT * FROM users WHERE oauth_provider = $1 AND oauth_id = $2",
      ["google", sub]
    );

    let user;

    if (result.rows.length === 0) {
      // 3. Create new user
      const insertRes = await client.query(
        `INSERT INTO users (email, username, oauth_provider, oauth_id, avatar_url)
                 VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [email, userName, "google", sub, picture]
      );
      user = insertRes.rows[0];
    } else {
      user = result.rows[0];
    }

    // 4. Issue session or JWT token
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google login failed" });
  }
};

//Sign In With Facebok
const signInFacebook = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = { signInGoogle, signInFacebook };
