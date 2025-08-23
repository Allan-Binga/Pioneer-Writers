const client = require("../config/dbConfig");
const { Vonage } = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

// Activate SMS
const writerActivateSMS = async (req, res) => {
  const writerId = req.writerId;

  try {
    // Fetch writer
    const result = await client.query(
      `SELECT * FROM writers WHERE writer_id = $1`,
      [writerId]
    );
    const writer = result.rows[0];

    if (!writer) {
      return res.status(404).json({ message: "Writer not found" });
    }

    if (!writer.phone_number) {
      return res.status(400).json({ message: "Writer has no phone number" });
    }

    const from = "Pioneer";
    const to = writer.phone_number;
    const text = "Welcome! You have successfully subscribed to SMS updates.";

    // Send SMS
    const response = await vonage.sms.send({ to, from, text });

    if (response.messages[0].status === "0") {
      // Update sms_updates column to true
      await client.query(
        `UPDATE writers SET sms_updates = true WHERE writer_id = $1`,
        [writerId]
      );

      return res.status(200).json({
        success: true,
        message: "SMS sent successfully",
        response: response.messages[0],
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send SMS",
        error: response.messages[0]["error-text"],
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

// Activate SMS for clients
const clientActivateSMS = async (req, res) => {
  const clientId = req.userId;

  try {
    // Fetch Client
    const result = await client.query(
      `SELECT * FROM users WHERE user_id = $1`,
      [clientId]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "Client not found" });
    }

    if (!user.phone_number) {
      return res.status(400).json({ message: "Client has no phone number" });
    }

    if (user.sms_updates) {
      return res.status(400).json({
        success: false,
        message: "Client already subscribed to SMS updates.",
      });
    }

    const from = "Pioneer";
    const to = user.phone_number;
    const text = "Welcome! You have successfully subscribed to SMS updates.";

    // Send SMS
    const response = await vonage.sms.send({ to, from, text });

    if (response.messages[0].status === "0") {
      // Update sms_updates column to true
      await client.query(
        `UPDATE users SET sms_updates = TRUE WHERE user_id = $1`,
        [clientId]
      );

      return res.status(200).json({
        success: true,
        message: "SMS sent successfully and subscription activated",
        response: response.messages[0],
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send SMS",
        error: response.messages[0]["error-text"],
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
  }
};

//Deactivate SMS
const writerDeactivateSMS = async (req, res) => {
  const writerId = req.writerId;
  try {
    //Fetch Writer
    const result = await client.query(
      `SELECT * FROM writers WHERE writer_id = $1`,
      [writerId]
    );

    const writer = result.rows[0];

    if (!writer) {
      return res.status(404).json({ message: "Writer not found" });
    }

    if (!writer.sms_updates) {
      return res.status(400).json({
        success: false,
        message: "You are already unsubscribed from SMS updates.",
      });
    }

    //UPdate column to false
    await client.query(
      `UPDATE writers SET sms_updates = FALSE where writer_id = $1`,
      [writerId]
    );

    return res.status(200).json({
      success: true,
      message: "SMS subscription daectivated successfully.",
    });
  } catch (error) {}
};

//Deactivate SMS for clients
const clientDeactivateSMS = async (req, res) => {
  const clientId = req.userId;
  try {
    //Fetch Client
    const result = await client.query(
      `SELECT * FROM users WHERE user_id = $1`,
      [clientId]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "Client not found" });
    }

    if (!user.sms_updates) {
      return res.status(400).json({
        success: false,
        message: "You are already unsubscribed from SMS updates.",
      });
    }

    // Update sms_updates column to false
    await client.query(
      `UPDATE users SET sms_updates = FALSE WHERE user_id = $1`,
      [clientId]
    );

    return res.status(200).json({
      success: true,
      message: "SMS subscription daectivated successfully.",
    });
  } catch (error) {
    console.error("Internal server error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
  }
};

module.exports = {
  writerActivateSMS,
  writerDeactivateSMS,
  clientActivateSMS,
  clientDeactivateSMS,
};
