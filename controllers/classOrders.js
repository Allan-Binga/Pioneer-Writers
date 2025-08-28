const client = require("../config/dbConfig");
const Joi = require("joi");

//Post Class Help Order
const postClassOrder = async (req, res) => {
  const userId = req.userId;
  try {
    //Joi Schema
    const schema = Joi.object({
      class_help_id: Joi.string()
        .guid({ version: ["uuidv4"] })
        .optional(),
      subject: Joi.string().max(100).required(),
      course_code: Joi.string().max(50).required(),
      academic_level: Joi.string().max(50).required(),
      week_range: Joi.string().max(50).required(),
      budget: Joi.number().precision(2).min(0).required(),
      login_url: Joi.string().uri().required(),
      login_username: Joi.string().max(100).required(),
      login_password: Joi.string().max(100).required(),
      notes: Joi.string().allow("", null),
      class_status: Joi.string()
        .valid("Pending", "In Progress", "Completed", "Cancelled")
        .optional(),
      payment_status: Joi.string()
        .valid("Unpaid", "Paid", "Refunded")
        .optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const uploadedSyllabus = req.files?.[0]?.location || null;

    let query;
    let values;

    // If updating an existing class_help_order
    if (value.class_help_id) {
      const checkQuery = `
        SELECT 1 FROM class_help_orders 
        WHERE class_help_id = $1 AND user_id = $2
      `;
      const checkResult = await client.query(checkQuery, [
        value.class_help_id,
        userId,
      ]);
      if (checkResult.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Class help order not found or unauthorized" });
      }

      query = `
        UPDATE class_help_orders SET
          subject = $1, course_code = $2, academic_level = $3,
          week_range = $4, budget = $5, login_url = $6,
          login_username = $7, login_password = $8, notes = $9,
          uploaded_syllabus = COALESCE($10, uploaded_syllabus),
          class_status = $11, payment_status = $12, updated_at = CURRENT_TIMESTAMP
        WHERE class_help_id = $13 AND user_id = $14
        RETURNING *;
      `;
      values = [
        value.subject,
        value.course_code,
        value.academic_level,
        value.week_range,
        value.budget,
        value.login_url,
        value.login_username,
        value.login_password,
        value.notes || null,
        uploadedSyllabus,
        value.class_status || "Pending",
        value.payment_status || "Unpaid",
        value.class_help_id,
        userId,
      ];
    } else {
      // Insert a new class_help_order
      query = `
        INSERT INTO class_help_orders (
          user_id, subject, course_code, academic_level, week_range,
          budget, login_url, login_username, login_password, notes,
          uploaded_syllabus, class_status, payment_status
        )
        VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12, $13
        )
        RETURNING *;
      `;
      values = [
        userId,
        value.subject,
        value.course_code,
        value.academic_level,
        value.week_range,
        value.budget,
        value.login_url,
        value.login_username,
        value.login_password,
        value.notes || null,
        uploadedSyllabus,
        value.class_status || "Pending",
        value.payment_status || "Unpaid",
      ];
    }

    const { rows } = await client.query(query, values);
    const classOrder = rows[0];

    res.status(value.class_help_id ? 200 : 201).json({
      message: value.class_help_id
        ? "Class help order updated successfully."
        : "Class help order posted successfully.",
      classOrder,
    });
  } catch (error) {
    console.error("Error processing class help order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Fetch My Classes
const userClassOrders = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = { postClassOrder, userClassOrders };
