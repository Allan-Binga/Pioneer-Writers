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

// Joi schema for login
const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

//Admin Signup Schema
const adminSignUpSchema = Joi.object({
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(7).required(),
  password: Joi.string().min(6).required(),
});

//Admin Sign In Schema
const adminSignInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
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
        userId: user.rows[0].user_id,
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
    res.clearCookie("userPioneerSession");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Admin Logout Error:", error);
    res.status(500).json({ message: "Error occurred during logout." });
  }
};

//SignUp Administrator
const signUpAdmin = async (req, res) => {
  const { error, value } = adminSignUpSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, phoneNumber, password } = value;

  try {
    const existingAdmin = await client.query(
      `SELECT * FROM administrators WHERE email = $1`,
      [email]
    );

    if (existingAdmin.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "Admin already registered with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
      `
      INSERT INTO administrators (email, phone_number, password_hash)
      VALUES ($1, $2, $3)
      RETURNING admin_id, email, phone_number
      `,
      [email, phoneNumber, hashedPassword]
    );

    res.status(201).json({
      message: "Admin registered successfully.",
      admin: result.rows[0],
    });
  } catch (err) {
    console.error("Admin signup error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

//Sign In Admin
const signInAdmin = async (req, res) => {
  if (req.cookies?.pioneerAdminSession) {
    return res.status(400).json({ message: "Already logged in as admin." });
  }

  const { error, value } = adminSignInSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = value;

  try {
    const result = await client.query(
      `SELECT * FROM administrators WHERE email = $1`,
      [email]
    );

    const admin = result.rows[0];
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      {
        adminId: admin.admin_id,
        role: "Admin",
        email: admin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.cookie("pioneerAdminSession", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 12 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Admin login successful",
      admin: { email: admin.email, role: "Administrator" },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

//Sign Out Adminstrator
const signOutAdmin = async (req, res) => {
  try {
    if (!req.cookies?.pioneerAdminSession) {
      return res
        .status(400)
        .json({ message: "You are not logged in as admin." });
    }

    res.clearCookie("");
    res.status(200).json({ message: "Admin logout successful." });
  } catch (error) {
    console.error("Admin logout error:", error);
    res.status(500).json({ message: "Error occurred during logout." });
  }
};

module.exports = {
  signUp,
  signIn,
  signOut,
  signUpAdmin,
  signInAdmin,
  signOutAdmin,
};
