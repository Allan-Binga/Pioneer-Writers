const client = require("../config/dbConfig");
const nodemailer = require("nodemailer");
const Joi = require("joi");

const transporter = nodemailer.createTransport({
  service: "Zoho", // or Gmail or your SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Joi Users schema
const messageSchema = Joi.object({
  receiver_ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
  subject: Joi.string().min(3).max(150).required(),
  content: Joi.string().min(1).required(),
  order_id: Joi.string().uuid().optional(),
});

// Administrator Validation schema
const adminMessageSchema = Joi.object({
  target_type: Joi.string()
    .valid("specific_client", "client_category", "all_clients", "all_writers")
    .required(),
  target_value: Joi.alternatives()
    .try(Joi.array().items(Joi.string().uuid()), Joi.string(), Joi.any())
    .optional(),
  subject: Joi.string().min(3).max(150).required(),
  content: Joi.string().min(1).required(),
});

// Send Mail Controller
const sendMessageToWriter = async (req, res) => {
  const senderId = req.userId;

  // Validate input
  const { error, value } = messageSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { receiver_ids, subject, content, order_id } = value;

  try {
    // 1. Get sender details from users table
    const senderResult = await client.query(
      `SELECT username, email FROM users WHERE user_id = $1`,
      [senderId]
    );
    const sender = senderResult.rows[0];

    if (!sender) {
      return res.status(404).json({ error: "Sender not found." });
    }

    // 2. Get writers by ID
    const { rows: writers } = await client.query(
      `SELECT writer_id, email FROM writers WHERE writer_id = ANY($1::uuid[])`,
      [receiver_ids]
    );

    if (writers.length === 0) {
      return res.status(404).json({ error: "No valid writers found." });
    }

    // 3. Send email and insert message per writer
    for (const writer of writers) {
      const mailOptions = {
        from: `"${sender.username}" <${process.env.EMAIL_USER}>`,
        to: writer.email,
        subject: subject,
        text: content,
        html: `<p>${content}</p>`,
        replyTo: sender.email,
      };

      await transporter.sendMail(mailOptions);

      await client.query(
        `INSERT INTO messages (sender_id, receiver_id, sender_type, subject, content, order_id, is_read, is_archived, is_trashed)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          senderId,
          writer.writer_id,
          "client",
          subject,
          content,
          order_id || null,
          false, // is_read
          false, // is_archived
          false, // is_trashed
        ]
      );
    }

    return res.status(200).json({ message: "Messages sent successfully." });
  } catch (err) {
    console.error("Error sending messages:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get Messages
const getMyMessages = async (req, res) => {
  const userId = req.userId;
  const filter = req.query.filter || "all"; // Default to all messages

  try {
    let query = `
      SELECT 
        m.*,
        COALESCE(usender.email, wsender.email) AS sender_email,
        COALESCE(ureceiver.email, wreceiver.email) AS receiver_email
      FROM messages m
      LEFT JOIN users usender ON m.sender_type = 'client' AND m.sender_id = usender.user_id
      LEFT JOIN writers wsender ON m.sender_type = 'writer' AND m.sender_id = wsender.writer_id
      LEFT JOIN users ureceiver ON m.receiver_id = ureceiver.user_id
      LEFT JOIN writers wreceiver ON m.receiver_id = wreceiver.writer_id
      WHERE 1=1
    `;

    const queryParams = [userId];

    if (filter === "sent") {
      query += ` AND m.sender_id = $1`;
    } else if (filter === "inbox") {
      query += ` AND m.receiver_id = $1`;
    } else if (filter === "unread") {
      query += ` AND m.receiver_id = $1 AND m.is_read = false`;
    } else if (filter === "archived") {
      query += ` AND (m.sender_id = $1 OR m.receiver_id = $1) AND m.is_archived = true`;
    } else if (filter === "trash") {
      query += ` AND (m.sender_id = $1 OR m.receiver_id = $1) AND m.is_trashed = true`;
    } else {
      query += ` AND (m.sender_id = $1 OR m.receiver_id = $1)`; // Default: all messages
    }

    query += ` ORDER BY m.sent_at DESC`;

    const { rows: messages } = await client.query(query, queryParams);

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//Administrator sending Messages
const administratorMessageService = async (req, res) => {
  const senderId = req.adminId; // admin's ID
  const { error, value } = adminMessageSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { target_type, target_value, subject, content } = value;

  try {
    // Get admin email
    const {
      rows: [admin],
    } = await client.query(
      `SELECT full_name, email FROM administrators WHERE admin_id = $1`,
      [senderId]
    );
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    let recipients = [];

    switch (target_type) {
      case "specific_client":
        recipients = await client.query(
          `SELECT user_id, email FROM users WHERE user_id = ANY($1::uuid[])`,
          [target_value]
        );
        break;

      case "client_category":
        recipients = await client.query(
          `SELECT user_id, email FROM users WHERE client_type = $1`,
          [target_value] // 'assignment' or 'online_class'
        );
        break;

      case "all_clients":
        recipients = await client.query(`SELECT user_id, email FROM users`);
        break;

      case "all_writers":
        recipients = await client.query(
          `SELECT writer_id AS user_id, email FROM writers`
        );
        break;
    }

    if (recipients.rows.length === 0) {
      return res.status(404).json({ error: "No recipients found" });
    }

    // Loop and send
    for (const r of recipients.rows) {
      const mailOptions = {
        from: `"Pioneer Writers Team" <${process.env.EMAIL_USER}>`,
        to: r.email,
        subject,
        text: content,
        html: `<p>${content}</p>`,
        replyTo: admin.email,
      };

      await transporter.sendMail(mailOptions);

      await client.query(
        `INSERT INTO messages (
          sender_id, receiver_id, sender_type, subject, content, is_read, is_archived, is_trashed
        ) VALUES ($1, $2, 'admin', $3, $4, false, false, false)`,
        [senderId, r.user_id, subject, content]
      );
    }

    return res
      .status(200)
      .json({ message: "Emails/messages sent successfully." });
  } catch (err) {
    console.error("Admin message error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//Get Administrator Messages
const getAdminMessages = async (req, res) => {
  const filter = req.query.filter || "all"; // inbox, sent, unread, etc.

  try {
    let query = `
      SELECT 
        m.*,
        COALESCE(usender.email, wsender.email, 'Admin') AS sender_email,
        COALESCE(ureceiver.email, wreceiver.email, 'Admin') AS receiver_email
      FROM messages m
      LEFT JOIN users usender ON m.sender_type = 'client' AND m.sender_id = usender.user_id
      LEFT JOIN writers wsender ON m.sender_type = 'writer' AND m.sender_id = wsender.writer_id
      LEFT JOIN users ureceiver ON m.receiver_id = ureceiver.user_id AND m.receiver_id IS NOT NULL
      LEFT JOIN writers wreceiver ON m.receiver_id = wreceiver.writer_id AND m.receiver_id IS NOT NULL
      WHERE 1=1
    `;

    // Optional filters
    if (filter === "sent_by_admin") {
      query += ` AND m.sender_type = 'admin'`;
    } else if (filter === "inbox_clients") {
      query += ` AND m.receiver_id IN (SELECT user_id FROM users)`;
    } else if (filter === "inbox_writers") {
      query += ` AND m.receiver_id IN (SELECT writer_id FROM writers)`;
    } else if (filter === "unread") {
      query += ` AND m.is_read = false`;
    } else if (filter === "archived") {
      query += ` AND m.is_archived = true`;
    } else if (filter === "trash") {
      query += ` AND m.is_trashed = true`;
    }

    query += ` ORDER BY m.sent_at DESC`;

    const { rows: messages } = await client.query(query);

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching admin messages:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  sendMessageToWriter,
  getMyMessages,
  administratorMessageService,
  getAdminMessages,
};
