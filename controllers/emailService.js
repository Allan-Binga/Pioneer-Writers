const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Zoho", // or Gmail or your SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Welcome Writers Email
const welcomeWritersEmail = async (email) => {
  const logoUrl =
    "https://pioneer-writers-bucket.s3.eu-north-1.amazonaws.com/pioneer-writers/logo.webp";

  const mailOptions = {
    from: `"Pioneer Writers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Pioneer Writers!",
    html: `
      <div style="margin:0; padding:0; background-color:#f5f7fa; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f7fa; padding:20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="padding:32px 40px; text-align:center; background-color:#ffffff; border-bottom:1px solid #e5e7eb;">
                    <img src="${logoUrl}" alt="Pioneer Writers" style="height:40px; width:auto;" />
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding:40px; background-color:#ffffff;">
                    <h1 style="margin:0 0 24px 0; font-size:24px; font-weight:600; color:#111827; line-height:1.2;">
                      Welcome aboard!
                    </h1>
                    <p style="margin:0 0 24px 0; font-size:16px; color:#374151; line-height:1.5;">
                      We're thrilled to have you join <strong>Pioneer Writers</strong>. 
                      As part of our community, you’ll have the opportunity to share your voice, 
                      grow your skills, and collaborate with other passionate writers.
                    </p>
                    <p style="margin:0 0 32px 0; font-size:16px; color:#374151; line-height:1.5;">
                      Get started by exploring your dashboard and bid for orders.
                    </p>
                    
                    <table cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
  <tr>
    <td style="border-radius:6px; background-color:#3b82f6; text-align:center;">
      <a href="${
        process.env.WRITER_CLIENT_URL
      }/public-orders" style="display:inline-block; padding:14px 24px; background-color:#3b82f6; color:#ffffff; font-size:16px; font-weight:500; text-decoration:none; border-radius:6px;">
        Start bidding for orders!
      </a>
    </td>
  </tr>
</table>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:24px 40px; background-color:#f9fafb; border-top:1px solid #e5e7eb;">
                    <p style="margin:0; font-size:12px; color:#9ca3af; line-height:1.4;">
                      © ${new Date().getFullYear()} Pioneer Writers. All rights reserved.
                    </p>
                    <p style="margin:8px 0 0 0; font-size:12px; color:#9ca3af; line-height:1.4;">
                      If you have any questions, reach out to us at 
                      <a href="mailto:team@pioneerwriters.com" style="color:#3b82f6; text-decoration:none;">team@pioneerwriters.com</a>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending welcome email:`, error);
    throw error;
  }
};

// Password Reset Email
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/password/reset?token=${token}`;
  const logoUrl =
    "https://pioneer-writers-bucket.s3.eu-north-1.amazonaws.com/pioneer-writers/logo.webp";

  const mailOptions = {
    from: `"Pioneer Writers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your Pioneer Writers password",
    html: `
      <div style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="padding: 32px 40px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
                    <img src="${logoUrl}" alt="Pioneer Writers" style="height: 40px; width: auto;" />
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 40px 32px 40px; background-color: #ffffff;">
                    <h1 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 600; color: #111827; line-height: 1.2;">
                      Reset your password
                    </h1>
                    <p style="margin: 0 0 32px 0; font-size: 16px; color: #374151; line-height: 1.5;">
                      We received a request to reset the password for your Pioneer Writers account. If you made this request, click the button below to reset your password.
                    </p>
                    
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-radius: 6px; background-color: #3b82f6;">
                          <a href="${resetUrl}" style="display: inline-block; padding: 14px 24px; background-color: #3b82f6; color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; border-radius: 6px;">
                            Reset password
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 32px 0 0 0; font-size: 14px; color: #6b7280; line-height: 1.5;">
                      If you didn't request a password reset, you can ignore this email. Your password won't be changed.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.4;">
                      © ${new Date().getFullYear()} Pioneer Writers. All rights reserved.
                    </p>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af; line-height: 1.4;">
                      This email was sent to ${email}. If you have questions, contact us at 
                      <a href="mailto:team@pioneerwriters.com" style="color: #3b82f6; text-decoration: none;">team@pioneerwriters.com</a>
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending password reset email:`, error);
    throw error;
  }
};

// Order Placement Email
const sendOrderPlacementEmail = async (email, order) => {
  const logoUrl =
    "https://pioneer-writers-bucket.s3.eu-north-1.amazonaws.com/pioneer-writers/logo.webp";

  const mailOptions = {
    from: `"Pioneer Writers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Order Confirmation – ${order.topic || "Your Order"}`,
    html: `
      <div style="margin:0; padding:0; background-color:#f5f7fa; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f7fa; padding:30px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <tr>
                  <td style="padding:30px; text-align:center; border-bottom:1px solid #e5e7eb;">
                    <img src="${logoUrl}" alt="Pioneer Writers" style="height:45px; width:auto;" />
                  </td>
                </tr>
                
                <!-- Success Banner -->
                <tr>
                  <td style="padding:20px 30px; text-align:center; background-color:#f0fdf4; border-bottom:1px solid #dcfce7;">
                    <span style="font-size:15px; font-weight:600; color:#166534;">
                      ✅ Your order has been placed successfully
                    </span>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding:40px 30px; text-align:center; background-color:#ffffff;">
                    <h1 style="margin:0 0 16px 0; font-size:24px; font-weight:700; color:#111827; line-height:1.2;">
                      Thank you for your order!
                    </h1>
                    <p style="margin:0 0 28px 0; font-size:16px; color:#374151; line-height:1.6; max-width:480px; margin-left:auto; margin-right:auto;">
                      We’ve received your order and our expert writers are now reviewing it. 
                      You can track progress, view bids, and receive updates directly on your dashboard.
                    </p>
                    
                    <a href="${process.env.CLIENT_URL}/order-details/${
      order.order_id
    }" 
                       style="display:inline-block; padding:14px 26px; background-color:#2563eb; color:#ffffff; font-size:16px; font-weight:600; text-decoration:none; border-radius:6px;">
                      Track Your Order
                    </a>
                  </td>
                </tr>
                
                <!-- Order Details -->
                <tr>
                  <td style="padding:32px 30px; background-color:#f9fafb;">
                    <h2 style="margin:0 0 20px 0; font-size:18px; font-weight:600; color:#111827; text-align:left;">
                      Order Summary
                    </h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0; font-size:14px; color:#6b7280; width:140px;">Subject:</td>
                        <td style="padding:6px 0; font-size:14px; color:#111827; font-weight:500;">${
                          order.subject
                        }</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; font-size:14px; color:#6b7280;">Topic:</td>
                        <td style="padding:6px 0; font-size:14px; color:#111827; font-weight:500;">${
                          order.topic
                        }</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; font-size:14px; color:#6b7280;">Pages:</td>
                        <td style="padding:6px 0; font-size:14px; color:#111827; font-weight:500;">${
                          order.pages
                        }</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; font-size:14px; color:#6b7280;">Deadline:</td>
                        <td style="padding:6px 0; font-size:14px; color:#111827; font-weight:500;">
                          ${new Date(order.deadline).toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; font-size:14px; color:#6b7280;">Writer Level:</td>
                        <td style="padding:6px 0; font-size:14px; color:#111827; font-weight:500;">${
                          order.writer_level
                        }</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; font-size:14px; color:#6b7280;">Total Amount:</td>
                        <td style="padding:6px 0; font-size:14px; color:#111827; font-weight:500;">$${
                          order.total_price
                        }</td>
                      </tr>
                      <tr style="border-top:1px solid #e5e7eb;">
                        <td style="padding:14px 0 6px 0; font-size:15px; color:#111827; font-weight:600;">Checkout Amount:</td>
                        <td style="padding:14px 0 6px 0; font-size:15px; color:#111827; font-weight:600;">$${
                          order.checkout_amount
                        }</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding:24px 30px; background-color:#f9fafb; border-top:1px solid #e5e7eb; text-align:center;">
                    <p style="margin:0; font-size:12px; color:#9ca3af; line-height:1.5;">
                      © ${new Date().getFullYear()} Pioneer Writers. All rights reserved.
                    </p>
                    <p style="margin:6px 0 0 0; font-size:12px; color:#9ca3af; line-height:1.5;">
                      Questions? Contact us at 
                      <a href="mailto:team@pioneerwriters.com" style="color:#2563eb; text-decoration:none;">team@pioneerwriters.com</a>
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send order email:", error);
    throw error;
  }
};

// Order Payment Email
const orderPaymentEmail = async (email, order, amount, transactionId) => {
  const logoUrl =
    "https://pioneer-writers-bucket.s3.eu-north-1.amazonaws.com/pioneer-writers/logo.webp";

  const mailOptions = {
    from: `"Pioneer Writers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Payment received - Order #${order.order_id}`,
    html: `
      <div style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="padding: 32px 40px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
                    <img src="${logoUrl}" alt="Pioneer Writers" style="height: 40px; width: auto;" />
                  </td>
                </tr>
                
                <!-- Success Banner -->
                <tr>
                  <td style="padding: 24px 40px; background-color: #f0fdf4; border-bottom: 1px solid #dcfce7;">
                    <div style="display: flex; align-items: center;">
                      <div style="width: 20px; height: 20px; background-color: #22c55e; border-radius: 50%; margin-right: 12px; display: inline-block;"></div>
                      <span style="font-size: 14px; font-weight: 500; color: #166534;">
                        Payment successfully processed
                      </span>
                    </div>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 40px 32px 40px; background-color: #ffffff;">
                    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #111827; line-height: 1.2;">
                      Payment received
                    </h1>
                    <p style="margin: 0 0 8px 0; font-size: 16px; color: #374151; line-height: 1.5;">
                      We've successfully processed your payment of <strong>$${amount}</strong> for Order #${
      order.order_id
    }.
                    </p>
                    <p style="margin: 0 0 32px 0; font-size: 16px; color: #374151; line-height: 1.5;">
                      Your order is now active and our writers will begin working on it shortly.
                    </p>
                    
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-radius: 6px; background-color: #3b82f6;">
                          <a href="${process.env.CLIENT_URL}/order-details/${
      order.order_id
    }" style="display: inline-block; padding: 14px 24px; background-color: #3b82f6; color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; border-radius: 6px;">
                            View your order
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Payment Details -->
                <tr>
                  <td style="padding: 32px 40px; background-color: #f9fafb;">
                    <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #111827;">
                      Payment details
                    </h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280; width: 140px;">Amount paid:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 600;">$${amount}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Payment method:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 500;">PayPal</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Transaction ID:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 500; font-family: monospace;">${transactionId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Date:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 500;">${new Date().toLocaleString()}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.4;">
                      © ${new Date().getFullYear()} Pioneer Writers. All rights reserved.
                    </p>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af; line-height: 1.4;">
                      Questions about your payment? Contact us at 
                      <a href="mailto:team@pioneerwriters.com" style="color: #3b82f6; text-decoration: none;">team@pioneerwriters.com</a>
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send payment email:", error);
    throw error;
  }
};

//Send Bid Email to Clients
const sendBidStatusEmail = async (email, orderId) => {
  const logoUrl =
    "https://pioneer-writers-bucket.s3.eu-north-1.amazonaws.com/pioneer-writers/logo.webp";

  const mailOptions = {
    from: `"Pioneer Writers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Bidding started for your order #${orderId}`,
    html: `
      <div style="margin:0;padding:0;background-color:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="padding:24px;text-align:center;border-bottom:1px solid #e5e7eb;">
                    <img src="${logoUrl}" alt="Pioneer Writers" style="height:40px;width:auto;" />
                  </td>
                </tr>

                <!-- Notification -->
                <tr>
                  <td style="padding:32px;text-align:left;">
                    <h1 style="margin:0 0 16px;font-size:20px;font-weight:600;color:#111827;">
                      Writers have started bidding!
                    </h1>
                    <p style="margin:0 0 24px;font-size:16px;color:#374151;line-height:1.5;">
                      Writers are now placing bids for your order <strong>#${orderId}</strong>.  
                      You can log in to view their proposals and select the best match.
                    </p>

                    <a href="${process.env.CLIENT_URL}/bids/order/${orderId}" 
                       style="display:inline-block;padding:12px 20px;background-color:#16a34a;color:#fff;font-size:14px;font-weight:500;text-decoration:none;border-radius:6px;">
                      View Bids
                    </a>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px;background-color:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;text-align:center;">
                    © ${new Date().getFullYear()} Pioneer Writers. All rights reserved.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send bid status email:", error);
  }
};

// Send Order Assignment Email
const sendWriterOrderAssignmentEmail = async (email, orderId) => {
  const logoUrl =
    "https://pioneer-writers-bucket.s3.eu-north-1.amazonaws.com/pioneer-writers/logo.webp";

  const mailOptions = {
    from: `"Pioneer Writers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `You have been assigned a new order #${orderId}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background: #f9fafb; padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,0.1);">
          
          <tr>
            <td style="padding:20px; text-align:center; border-bottom:1px solid #eee;">
              <img src="${logoUrl}" alt="Pioneer Writers" style="height:40px;" />
            </td>
          </tr>

          <tr>
            <td style="padding:30px; text-align:center;">
              <h2 style="margin:0 0 15px; font-size:20px; color:#111;">New Assignment</h2>
              <p style="margin:0 0 20px; font-size:16px; color:#374151; line-height:1.5;">
                You’ve been assigned to work on <strong>Order #${orderId}</strong>.  
                Please log in to view the order details and get started.
              </p>
              <a href="${
                process.env.WRITER_CLIENT_URL
              }/order-details/${orderId}" 
                 style="display:inline-block; padding:12px 24px; background:#2563eb; color:#fff; text-decoration:none; border-radius:6px; font-size:15px; font-weight:500;">
                View Order
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:15px; background:#f9fafb; font-size:12px; color:#9ca3af; text-align:center;">
              © ${new Date().getFullYear()} Pioneer Writers
            </td>
          </tr>

        </table>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send assignment email:", error);
  }
};

// Deadline Extension Email
const sendDeadlineExtensionEmail = async (email, orderId, newDeadline) => {
  const logoUrl =
    "https://pioneer-writers-bucket.s3.eu-north-1.amazonaws.com/pioneer-writers/logo.webp";

  const mailOptions = {
    from: `"Pioneer Writers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Deadline Extended for Order #${orderId}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background: #f9fafb; padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,0.1);">
          
          <tr>
            <td style="padding:20px; text-align:center; border-bottom:1px solid #eee;">
              <img src="${logoUrl}" alt="Pioneer Writers" style="height:40px;" />
            </td>
          </tr>

          <tr>
            <td style="padding:30px; text-align:center;">
              <h2 style="margin:0 0 15px; font-size:20px; color:#111;">Deadline Extended</h2>
              <p style="margin:0 0 20px; font-size:16px; color:#374151; line-height:1.5;">
                The deadline for <strong>Order #${orderId}</strong> has been updated to 
                <strong>${newDeadline}</strong>. Please ensure you complete your work by this new date.
              </p>
              <a href="${
                process.env.WRITER_CLIENT_URL
              }/order-details/${orderId}" 
                 style="display:inline-block; padding:12px 24px; background:#2563eb; color:#fff; text-decoration:none; border-radius:6px; font-size:15px; font-weight:500;">
                View Order
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:15px; background:#f9fafb; font-size:12px; color:#9ca3af; text-align:center;">
              © ${new Date().getFullYear()} Pioneer Writers
            </td>
          </tr>

        </table>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send deadline extension email:", error);
  }
};

//Send Order Submission Email
const sendOrderSubmissionEmail = async (email, order) => {
  const logoUrl =
    "https://pioneer-writers-bucket.s3.eu-north-1.amazonaws.com/pioneer-writers/logo.webp";

  const mailOptions = {
    from: `"Pioneer Writers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your assignment has been submitted - Order #${order.order_id}`,
    html: `
      <div style="margin:0;padding:0;background-color:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="padding:24px;text-align:center;border-bottom:1px solid #e5e7eb;">
                    <img src="${logoUrl}" alt="Pioneer Writers" style="height:40px;width:auto;" />
                  </td>
                </tr>

                <!-- Notification -->
                <tr>
                  <td style="padding:32px;text-align:left;">
                    <h1 style="margin:0 0 16px;font-size:20px;font-weight:600;color:#111827;">
                      Your assignment has been submitted!
                    </h1>
                    <p style="margin:0 0 24px;font-size:16px;color:#374151;line-height:1.5;">
                      Your order <strong>#${
                        order.order_id
                      }</strong> has been submitted by the assigned writer.
                    </p>

                    <a href="${process.env.CLIENT_URL}/order-details/${
      order.order_id
    }" 
                       style="display:inline-block;padding:12px 20px;background-color:#2563eb;color:#fff;font-size:14px;font-weight:500;text-decoration:none;border-radius:6px;">
                      View Submitted Files
                    </a>
                  </td>
                </tr>

                <!-- Files Section -->
                <tr>
                  <td style="padding:24px;background-color:#f9fafb;">
                    <h2 style="margin:0 0 12px;font-size:16px;font-weight:600;color:#111827;">Submitted Files:</h2>
                    <ul style="margin:0;padding-left:20px;color:#374151;font-size:14px;">
                      ${order.submitted_files
                        .map(
                          (file) =>
                            `<li>
                                <a href="${
                                  file.url
                                }" style="color:#2563eb;text-decoration:none;" target="_blank">
                                  ${file.originalname}
                                </a>
                                <span style="color:#6b7280;font-size:12px;"> (submitted ${new Date(
                                  file.uploadedAt
                                ).toLocaleString()})</span>
                              </li>`
                        )
                        .join("")}
                    </ul>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px;background-color:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;text-align:center;">
                    © ${new Date().getFullYear()} Pioneer Writers. All rights reserved.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send submission email:", error);
  }
};

module.exports = {
  welcomeWritersEmail,
  sendPasswordResetEmail,
  sendOrderPlacementEmail,
  orderPaymentEmail,
  sendBidStatusEmail,
  sendWriterOrderAssignmentEmail,
  sendDeadlineExtensionEmail,
  sendOrderSubmissionEmail,
};
