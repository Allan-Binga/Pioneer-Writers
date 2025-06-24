const client = require("../config/dbConfig");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Joi schema for sign up
const signUpSchema = Joi.object({
  userName: Joi.string()
    .pattern(/^[A-Za-z][A-Za-z'\-]{2,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Name must be at least 3 characters and contain only valid characters.",
    }),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(7).required(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
});

//Sign Up Users
const signUp = async (req, res) => {
  const { error, value } = signUpSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { userName, email, phoneNumber, password } = value;

  try {
    const checkUser = `SELECT * FROM users WHERE email = $1`;
    const existingUser = await client.query(checkUser, [email]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message:
          "A user is already registered with this email. Please use another email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO users (username, email, phone_number, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id, username, email
    `;

    const result = await client.query(insertQuery, [
      userName,
      email,
      phoneNumber,
      hashedPassword,
    ]);

    res.status(201).json({
      message: "Successful registration.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("User registration Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Joi schema for login
const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

//Sign In Users
const signIn = async (req, res) => {
  if (req.cookies?.userPioneerSession) {
    return res.status(400).json({ message: "You are already logged in." });
  }

  const { error, value } = signInSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = value;

  try {
    const checkUser = "SELECT * FROM users WHERE email = $1";
    const user = await client.query(checkUser, [email]);

    if (user.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Invalid credentials. Please retry." });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const userToken = jwt.sign(
      {
        id: user.rows.user_id,
        role: "Client",
        email: user.rows[0].email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("userPioneerSession", userToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        role: "Client",
        email: user.rows[0].email,
      },
    });
  } catch (error) {
    console.error("User login error", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

//User Logout
const signOut = async (req, res) => {
  try {
    if (!req.cookies?.userPioneerSession) {
      return res.status(400).json({ message: "You are not logged in." });
    }
    res.clearCookie("adminVotingSession");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Admin Logout Error:", error);
    res.status(500).json({ message: "Error occurred during logout." });
  }
};

module.exports = { signUp, signIn, signOut };
