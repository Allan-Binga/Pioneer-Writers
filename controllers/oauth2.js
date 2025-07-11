const client = require("../config/dbConfig");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

// Sign In with Google
const signInGoogle = async (req, res) => {
  try {
    // Check if already logged in
    if (req.cookies?.userPioneerSession) {
      return res.status(400).json({ message: "You are already logged in." });
    }

    const { token } = req.body;

    // Get Google profile
    const googleUserInfo = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ).then((res) => res.json());

    if (!googleUserInfo || !googleUserInfo.email) {
      return res.status(400).json({ message: "Invalid Google token." });
    }

    const email = googleUserInfo.email;
    const fullName = googleUserInfo.name || "";
    const username = fullName.trim() || email.split("@")[0]; // fallback
    const googleId = googleUserInfo.sub;
    const avatar = googleUserInfo.picture;

    // Upsert the user
    const query = `
      INSERT INTO users (user_id, username, email, oauth_provider, oauth_id, avatar_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO UPDATE SET
        username = EXCLUDED.username,
        avatar_url = EXCLUDED.avatar_url
      RETURNING *;
    `;

    const userId = uuidv4();
    const values = [userId, username, email, "google", googleId, avatar];
    const { rows } = await client.query(query, values);
    const user = rows[0];

    // Generate JWT
    const userToken = jwt.sign(
      {
        userId: user.user_id,
        role: user.role || "Client", // default if null
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set cookie
    res.cookie("userPioneerSession", userToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Respond
    return res.status(200).json({
      message: "Google sign-in successful",
      user: {
        role: user.role || "Client",
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Google sign-in error:", err);
    return res
      .status(500)
      .json({ message: "Google sign-in failed", error: err.message });
  }
};

//Sign In With Facebok
const signInFacebook = async (req, res) => {
  try {
    // Check if already logged in
    if (req.cookies?.userPioneerSession) {
      return res.status(400).json({ message: "You are already logged in." });
    }

    const { token } = req.body;

    // Get user info from Facebook
    const facebookUserInfo = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`
    ).then((res) => res.json());

    if (!facebookUserInfo || !facebookUserInfo.email) {
      return res.status(400).json({ message: "Invalid Facebook token." });
    }

    const email = facebookUserInfo.email;
    const fullName = facebookUserInfo.name || "";
    const username = fullName.trim() || email.split("@")[0];
    const facebookId = facebookUserInfo.id;
    const avatar = facebookUserInfo.picture?.data?.url;

    // Upsert the user
    const query = `
      INSERT INTO users (user_id, username, email, oauth_provider, oauth_id, avatar_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO UPDATE SET
        username = EXCLUDED.username,
        avatar_url = EXCLUDED.avatar_url
      RETURNING *;
    `;

    const userId = uuidv4();
    const values = [userId, username, email, "facebook", facebookId, avatar];
    const { rows } = await client.query(query, values);
    const user = rows[0];

    // Generate JWT
    const userToken = jwt.sign(
      {
        userId: user.user_id,
        role: user.role || "Client",
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set cookie
    res.cookie("userPioneerSession", userToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Respond
    return res.status(200).json({
      message: "Facebook sign-in successful",
      user: {
        role: user.role || "Client",
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Facebook sign-in error:", err);
    return res
      .status(500)
      .json({ message: "Facebook sign-in failed", error: err.message });
  }
};

module.exports = { signInGoogle, signInFacebook };
