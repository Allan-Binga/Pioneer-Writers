const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const ordersRoute = require("./routes/orders");
const paymentsRoute = require("./routes/payments");
const checkoutRoute = require("./routes/orderCheckout");
const oauth2Route = require("./routes/oauth2");
const usersRoute = require("./routes/users");
const draftRoute = require("./routes/drafts");
const inboxRoute = require("./routes/inbox");
const writersRoute = require("./routes/writers");
const profileRoute = require("./routes/profile");
const {
  handlePaypalWebhook,
  handleStripeWebhook,
} = require("./controllers/webhook");

//Import DB connection
require("./config/dbConfig");

dotenv.config();
const app = express();

// Stripe webhook raw-body middleware
app.post(
  "/pioneer-writers/v1/webhook/stripe",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

//Paypal Webhook json middleware
app.post(
  "/pioneer-writers/v1/webhook/paypal",
  express.json(),
  handlePaypalWebhook
);

// All other routes use JSON
app.use(express.json());

//CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://pioneer-administrator.vercel.app",
  "https://pioneer-writers-8a531f1c7067.herokuapp.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Blocked by CORS."));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

//Cookie-parser
app.use(cookieParser());

//Routes
app.use("/pioneer-writers/v1/auth", authRoute);
app.use("/pioneer-writers/v1/oauth2", oauth2Route);
app.use("/pioneer-writers/v1/orders", ordersRoute);
app.use("/pioneer-writers/v1/inbox", inboxRoute);
app.use("/pioneer-writers/v1/payments", paymentsRoute);
app.use("/pioneer-writers/v1/checkout", checkoutRoute);
app.use("/pioneer-writers/v1/users", usersRoute);
app.use("/pioneer-writers/v1/drafts", draftRoute);

app.use("/pioneer-writers/v1/writers", writersRoute);
app.use("/pioneer-writers/v1/profile", profileRoute);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const clientDistPath = path.join(__dirname, "client", "dist");
  app.use(express.static(clientDistPath));

  // Fallback for frontend routes
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/pioneer-writers")) {
      res.sendFile(path.join(clientDistPath, "index.html"));
    } else {
      next();
    }
  });
}

//Server start
const PORT = process.env.PORT || 6100;

// Start the server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 6100;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}
