const client = require("../config/dbConfig");
const Joi = require("joi");
const {
  sendOrderPlacementEmail,
  sendOrderSubmissionEmail,
} = require("./emailService");

// Post/Update an order
const postOrder = async (req, res) => {
  const userId = req.userId;

  try {
    const orderStatus = req.body.order_status;

    const strictSchema = Joi.object({
      order_id: Joi.string()
        .guid({ version: ["uuidv4"] })
        .optional(),
      subject: Joi.string().required(),
      type_of_service: Joi.string().required(),
      document_type: Joi.string().required(),
      writer_level: Joi.string().required(),
      paper_format: Joi.string().required(),
      english_type: Joi.string().required(),
      pages: Joi.number().integer().min(1).required(),
      spacing: Joi.string().required(),
      number_of_words: Joi.number().integer().min(0),
      number_of_sources: Joi.number().integer().min(0),
      slides: Joi.number().integer().min(0),
      charts_or_graphs: Joi.number().integer().min(0),
      topic: Joi.string().required(),
      instructions: Joi.string().allow(""),
      writer_category: Joi.string().required(),
      deadline: Joi.date().iso().required(),
      total_price: Joi.number().min(0).required(),
      checkout_amount: Joi.number().min(0).required(),
      writer_tip: Joi.number().min(0).allow(null),
      plagiarism_report: Joi.boolean(),
      order_status: Joi.string()
        .valid("draft", "pending", "paid", "cancelled")
        .optional(),
      payment_option: Joi.string().allow(""),
      coupon_code: Joi.string().allow(""),
    });

    const draftSchema = Joi.object({
      order_id: Joi.string()
        .guid({ version: ["uuidv4"] })
        .optional(),
      subject: Joi.string().allow("", null),
      type_of_service: Joi.string().allow("", null),
      document_type: Joi.string().allow("", null),
      writer_level: Joi.string().allow("", null),
      paper_format: Joi.string().allow("", null),
      english_type: Joi.string().allow("", null),
      pages: Joi.number().integer().min(0).allow(null),
      spacing: Joi.string().allow("", null),
      number_of_words: Joi.number().integer().min(0).allow(null),
      number_of_sources: Joi.number().integer().min(0).allow(null),
      slides: Joi.number().integer().min(0).allow(null),
      charts_or_graphs: Joi.number().integer().min(0).allow(null),
      topic: Joi.string().allow("", null),
      instructions: Joi.string().allow("", null),
      writer_category: Joi.string().allow("", null),
      deadline: Joi.date().iso().allow(null),
      total_price: Joi.number().min(0).allow(null),
      checkout_amount: Joi.number().min(0).allow(null),
      writer_tip: Joi.number().min(0).allow(null),
      plagiarism_report: Joi.boolean().allow(null),
      order_status: Joi.string()
        .valid("draft", "pending", "paid", "cancelled")
        .optional(),
      payment_option: Joi.string().allow("", null),
      coupon_code: Joi.string().allow("", null),
    });

    const schema = orderStatus === "draft" ? draftSchema : strictSchema;
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const uploadedFile = req.files?.[0]?.location || null;

    let query;
    let values;

    if (value.order_id) {
      const checkQuery = `SELECT 1 FROM orders WHERE order_id = $1 AND user_id = $2`;
      const checkResult = await client.query(checkQuery, [
        value.order_id,
        userId,
      ]);
      if (checkResult.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Order not found or unauthorized" });
      }

      query = `
        UPDATE orders SET
          subject = $1, type_of_service = $2, document_type = $3,
          writer_level = $4, paper_format = $5, english_type = $6,
          pages = $7, spacing = $8, number_of_words = $9, number_of_sources = $10,
          topic = $11, instructions = $12, uploaded_file = $13, writer_category = $14,
          deadline = $15, total_price = $16, checkout_amount = $17,
          writer_tip = $18, plagiarism_report = $19, payment_option = $20,
          coupon_code = $21, order_status = $22, slides = $23,
          charts_or_graphs = $24, updated_at = CURRENT_TIMESTAMP
        WHERE order_id = $25 AND user_id = $26
        RETURNING *;
      `;
      values = [
        value.subject,
        value.type_of_service,
        value.document_type,
        value.writer_level,
        value.paper_format,
        value.english_type,
        value.pages,
        value.spacing,
        value.number_of_words,
        value.number_of_sources,
        value.topic,
        value.instructions,
        uploadedFile,
        value.writer_category,
        value.deadline,
        value.total_price,
        value.checkout_amount,
        value.writer_tip || null,
        value.plagiarism_report ?? false,
        value.payment_option || "",
        value.coupon_code || "",
        value.order_status || "pending",
        value.slides || 0,
        value.charts_or_graphs || 0,
        value.order_id,
        userId,
      ];
    } else {
      query = `
        INSERT INTO orders (
          subject, type_of_service, document_type, writer_level,
          paper_format, english_type, pages, spacing, number_of_words,
          number_of_sources, topic, instructions, uploaded_file,
          writer_category, deadline, total_price, checkout_amount,
          writer_tip, plagiarism_report, payment_option, coupon_code,
          user_id, slides, charts_or_graphs
        )
        VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12, $13, $14,
          $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24
        )
        RETURNING *;
      `;
      values = [
        value.subject,
        value.type_of_service,
        value.document_type,
        value.writer_level,
        value.paper_format,
        value.english_type,
        value.pages,
        value.spacing,
        value.number_of_words,
        value.number_of_sources,
        value.topic,
        value.instructions,
        uploadedFile,
        value.writer_category,
        value.deadline,
        value.total_price,
        value.checkout_amount,
        value.writer_tip || null,
        value.plagiarism_report ?? false,
        value.payment_option || "",
        value.coupon_code || "",
        userId,
        value.slides || 0,
        value.charts_or_graphs || 0,
      ];
    }

    const { rows } = await client.query(query, values);
    const order = rows[0];

    if (order.order_status !== "draft") {
      (async () => {
        try {
          const userQuery = await client.query(
            "SELECT email FROM users WHERE user_id = $1",
            [userId]
          );
          const userEmail = userQuery.rows[0]?.email;

          if (userEmail) {
            await sendOrderPlacementEmail(userEmail, order);
          }

          const admin_id = "9631899f-1dbb-4a16-887e-52f10e9c4c16";
          const subject = `Order Confirmed: ${order.topic || "No Topic"}`;
          const content = `
            Thank you for placing your order with Pioneer Writers.

            Order Details:
            Subject: ${order.subject}
            Topic: ${order.topic}
            Pages: ${order.pages}
            Deadline: ${new Date(order.deadline).toLocaleString()}
            Total Price: $${order.total_price}

            Our writers will begin bidding soon. You can view updates in your inbox.
          `;

          await client.query(
            `INSERT INTO messages (sender_id, receiver_id, sender_type, subject, content, order_id)
             VALUES ($1, $2, 'admin', $3, $4, $5)`,
            [admin_id, userId, subject, content.trim(), order.order_id]
          );
        } catch (err) {
          console.error("Background task error:", err);
        }
      })();
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: "Order not found or unauthorized" });
    }

    res.status(value.order_id ? 200 : 201).json({
      message: value.order_id
        ? "Order updated successfully."
        : "Order posted successfully. Proceed to checkout.",
      order,
    });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch orders with role-based filtering
const getOrders = async (req, res) => {
  try {
    let query;
    let params = [];

    if (req.user.role === "Writer") {
      // Writers: only public orders
      const writerId = req.user.id;
      query = `
        SELECT 
          o.order_id, 
          o.subject, 
          o.topic, 
          o.deadline, 
          o.pages, 
          o.total_price, 
          o.assignment_status,
          EXISTS (
            SELECT 1 FROM bids b 
            WHERE b.order_id = o.order_id 
            AND b.writer_id = $1
          ) AS has_bid
        FROM orders o
        WHERE o.assignment_status = 'public'
      `;
      params = [writerId]; // Use writerId for the bids check
    } else if (req.user.role === "Admin") {
      // Admins: all orders
      query = `
        SELECT *
        FROM orders
      `;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const orders = await client.query(query, params);
    res.status(200).json(orders.rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

// Fetch single order with role-based filtering
const getSingleOrder = async (req, res) => {
  const { orderId } = req.params;
  const { id: userId, role } = req.user;

  try {
    let query;
    let params;

    if (role === "Writer") {
      // Writers: Can only view their assigned orders
      query = `
        SELECT o.order_id, o.english_type, o.paper_format, o.order_status,
               o.instructions, o.writer_level, o.subject, o.topic, o.deadline,
               o.pages, o.total_price, o.assignment_status,o.submitted_files, o.user_id,
               w.full_name AS writer_name
        FROM orders o
        LEFT JOIN writers w ON o.writer_id = w.writer_id
        WHERE o.order_id = $1
          AND o.writer_id = $2
      `;
      params = [orderId, userId];
    } else if (role === "Admin") {
      // Admins: Can view any order
      query = `
        SELECT o.*, w.full_name AS writer_name
        FROM orders o
        LEFT JOIN writers w ON o.writer_id = w.writer_id
        WHERE o.order_id = $1
      `;
      params = [orderId];
    } else if (role === "Client") {
      // Clients: Can only view their own orders
      query = `
        SELECT o.*, w.full_name AS writer_name
        FROM orders o
        LEFT JOIN writers w ON o.writer_id = w.writer_id
        WHERE o.order_id = $1
          AND o.user_id = $2
      `;
      params = [orderId, userId];
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { rows } = await client.query(query, params);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching single order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Public Order Details
const getPublicOrderDetails = async (req, res) => {
  const writerId = req.writerId;
  const { orderId } = req.params;

  try {
    const result = await client.query(
      `SELECT 
         o.order_id, 
         o.subject, 
         o.topic, 
         o.deadline, 
         o.number_of_words, 
         o.english_type, 
         o.number_of_sources, 
         o.uploaded_file, 
         o.spacing, 
         o.charts_or_graphs, 
         o.slides, 
         o.pages, 
         o.instructions, 
         o.assignment_status,
         o.type_of_service,
         o.document_type,
         o.writer_level,
         o.paper_format,
         o.plagiarism_report,
         o.created_at,
         EXISTS (
           SELECT 1 FROM bids b 
           WHERE b.order_id = o.order_id 
           AND b.writer_id = $2
         ) AS has_bid
       FROM orders o
       WHERE o.order_id = $1
         AND o.assignment_status = 'public'`,
      [orderId, writerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found or not public." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch Single Admin Order
const getAdminSingleOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const { rows } = await client.query(
      "SELECT * FROM orders WHERE order_id = $1",
      [orderId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    const order = rows[0];
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching admin single order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetch my orders
const getUsersOrders = async (req, res) => {
  const userId = req.userId;
  const { status } = req.query;

  try {
    let query = `
      SELECT o.*, w.full_name AS writer_name
      FROM orders o
      LEFT JOIN writers w ON o.writer_id = w.writer_id
      WHERE o.user_id = $1
    `;
    const params = [userId];

    if (status) {
      if (status === "in-progress") {
        query += " AND o.assignment_status = 'assigned'";
      } else if (status === "submitted") {
        query += " AND o.assignment_status = 'submitted'";
      } else if (status === "completed") {
        query += " AND o.assignment_status = 'completed'";
      } else if (status === "public") {
        query += " AND o.assignment_status = 'public'";
      }
    }

    const result = await client.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

//Fetch Writer's Orders
const getWritersOrders = async (req, res) => {
  const writerId = req.writerId;
  const { status } = req.query;
  try {
    let query = `
      SELECT o.*, u.username AS client_name
      FROM orders o
      LEFT JOIN USERS u ON o.writer_id = u.user_id
      WHERE o.writer_id = $1
    `;

    const params = [writerId];

    if (status) {
      if (status === "in-progress") {
        query += " AND o.assignment_status = 'assigned'";
      } else if (status === "submitted") {
        query += " AND o.assignment_status = 'submitted'";
      } else if (status === "completed") {
        query += " AND o.assignment_status = 'completed'";
      }
    }

    const result = await client.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

// Update Order
const updateOrder = async (req, res) => {
  const userId = req.userId; //(from middleware)

  try {
    const { orderId } = req.params;

    // Validation schema: all fields optional for PATCH
    const schema = Joi.object({
      topic_field: Joi.string(),
      type_of_service: Joi.string(),
      document_type: Joi.string(),
      writer_level: Joi.string(),
      paper_format: Joi.string(),
      english_type: Joi.string(),
      pages: Joi.number().integer().min(1),
      spacing: Joi.string(),
      number_of_words: Joi.number().integer().min(0),
      number_of_sources: Joi.number().integer().min(0),
      topic: Joi.string(),
      instructions: Joi.string().allow(""),
      writer_category: Joi.string(),
      deadline: Joi.date().iso(),
      writer_tip: Joi.number().min(0),
      plagiarism_report: Joi.boolean(),
      payment_option: Joi.string(),
      coupon_code: Joi.string().allow(""),
      base_price: Joi.number().min(0),
      additional_fees: Joi.number().min(0),
      total_price: Joi.number().min(0),
    }).min(1);

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Add uploaded file if available
    const uploadedFiles = req.files || [];
    const fileUrls = uploadedFiles.map((file) => file.location);
    if (fileUrls.length > 0) {
      value.uploaded_file = fileUrls[0];
    }

    // Build dynamic SQL SET clause
    const fields = Object.keys(value);
    const setClause = fields
      .map((field, idx) => `${field} = $${idx + 1}`)
      .join(", ");
    const values = Object.values(value);

    // Ensure we only update the order if it belongs to this user
    const query = `
      UPDATE orders
      SET ${setClause}
      WHERE order_id = $${fields.length + 1}
        AND user_id = $${fields.length + 2}
      RETURNING *;
    `;

    values.push(orderId, userId);

    const { rows } = await client.query(query, values);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Order not found or not owned by user." });
    }

    res.status(200).json({
      message: "Order updated successfully.",
      order: rows[0],
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Delete Order
const deleteOrder = async (req, res) => {
  const userId = req.userId;
  const { orderId } = req.params;

  try {
    // Check if order exists and belongs to the user
    const checkQuery = `SELECT * FROM orders WHERE order_id = $1`;
    const checkResult = await client.query(checkQuery, [orderId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found." });
    }

    const order = checkResult.rows[0];

    // Restrict deletion to owner
    if (order.user_id !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this order." });
    }

    // Proceed with deletion
    const deleteQuery = `DELETE FROM orders WHERE order_id = $1 RETURNING *`;
    const result = await client.query(deleteQuery, [orderId]);

    res.status(200).json({
      message: "Order deleted successfully.",
      deletedOrder: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Submit Assignment
const submitAssignment = async (req, res) => {
  const writerId = req.writerId;
  const { orderId } = req.params;

  try {
    // Ensure writer is actually assigned to this order
    const orderCheck = await client.query(
      `SELECT * FROM orders WHERE order_id = $1 AND writer_id = $2`,
      [orderId, writerId]
    );

    if (orderCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You are not assigned to this order." });
    }

    // Grab uploaded files from AWS middleware
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    // Map the file info into an array of URLs + metadata
    const fileData = files.map((file) => ({
      key: file.key,
      url: file.location,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    }));

    // Update DB: append submitted files + mark status as "submitted"
    const result = await client.query(
      `UPDATE orders 
       SET assignment_status = 'submitted',
           submitted_files = COALESCE(submitted_files, '[]'::jsonb) || $1::jsonb,
           updated_at = NOW()
       WHERE order_id = $2
       RETURNING *`,
      [JSON.stringify(fileData), orderId]
    );

    const order = result.rows[0];

    // Fetch client's email
    const userRes = await client.query(
      `SELECT email FROM users WHERE user_id = $1`,
      [order.user_id]
    );

    if (userRes.rows.length > 0) {
      const clientEmail = userRes.rows[0].email;
      console.log(clientEmail);

      // Send email notification
      await sendOrderSubmissionEmail(clientEmail, {
        ...order,
        submitted_files: fileData,
      });
    }

    res.status(200).json({
      message: "Assignment submitted successfully!",
      order,
    });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    res.status(500).json({ message: "Failed to submit assignment." });
  }
};

//Complete Assignment
const completeOrder = async (req, res) => {
  const userId = req.userId;
  const { orderId } = req.params;

  try {
    // 1. Check if a rating exists for this order
    const rating = await client.query(
      `SELECT * FROM ratings WHERE order_id = $1 AND user_id = $2`,
      [orderId, userId]
    );

    if (rating.rows.length === 0) {
      return res.status(400).json({
        message: "You must rate the writer before completing this order.",
      });
    }

    // 2. Update assignment_status in orders table
    await client.query(
      `UPDATE orders SET assignment_status = 'completed' WHERE order_id = $1`,
      [orderId]
    );

    return res.status(200).json({
      message: "Order marked as completed successfully.",
    });
  } catch (error) {
    console.error("Error completing order:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

//Disute Order
const disputeOrder = async (req, res) => {
  const userId = req.userId;
  const { orderId } = req.params;
  const { reason } = req.body;

  try {
    // Validate input
    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({ message: "Dispute reason is required." });
    }

    // Check if order exists and belongs to the user
    const order = await client.query(
      `SELECT * FROM orders WHERE order_id = $1 AND user_id = $2`,
      [orderId, userId]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({ message: "Order not found or not yours." });
    }

    // Check if order is already disputed
    const existingDispute = await client.query(
      `SELECT * FROM disputes WHERE order_id = $1 AND user_id = $2`,
      [orderId, userId]
    );

    if (existingDispute.rows.length > 0) {
      return res.status(400).json({ message: "Order is already disputed." });
    }

    // Extract uploaded file URLs (if any)
    const evidenceFiles = req.files?.map((file) => file.location) || [];

    // Insert dispute with evidence
    const newDispute = await client.query(
      `INSERT INTO disputes (order_id, user_id, reason, status, evidence_files)
       VALUES ($1, $2, $3, 'pending', $4)
       RETURNING dispute_id, order_id, user_id, reason, status, created_at, evidence_files`,
      [orderId, userId, reason, evidenceFiles]
    );

    // Update order status to indicate dispute
    await client.query(
      `UPDATE orders SET assignment_status = 'disputed' WHERE order_id = $1`,
      [orderId]
    );

    return res.status(201).json({
      message:
        "Dispute submitted successfully. Please wait as our team is working on resolving the issue.",
      dispute: newDispute.rows[0],
    });
  } catch (error) {
    console.error("Error submitting dispute:", error.message);
    return res
      .status(500)
      .json({ message: "Server error while submitting dispute." });
  }
};

module.exports = {
  postOrder,
  getOrders,
  getUsersOrders,
  getWritersOrders,
  updateOrder,
  deleteOrder,
  getSingleOrder,
  getPublicOrderDetails,
  getAdminSingleOrder,
  submitAssignment,
  completeOrder,
  disputeOrder,
};
