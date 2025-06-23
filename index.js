const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const ordersRoute = require("./routes/orders");
const paymentsRoute = require("./routes/payments");
const checkoutRoute = require("./routes/orderCheckout");

//Import DB connection
require("./config/dbConfig");

dotenv.config();
const app = express();

//JSON
app.use(express.json());

//CORS
const allowedOrigins = ["http://localhost:5173"];

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
app.use("/pioneer-writers/v1/orders", ordersRoute);
app.use("/pioneer-writers/v1/payments", paymentsRoute);
app.use("/pioneer-writers/v1/checkout", checkoutRoute);

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
