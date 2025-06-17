const express = require("express");
const cors = require("cors")
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth")
const ordersRoute = require("./routes/orders")

//Import DB connection
require("./config/config");

dotenv.config();
const app = express();

//JSON
app.use(express.json());

//CORS
const allowedOrigins = [];

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
app.use(cookieParser())

//Routes
app.use("/pioneer-writers/v1/auth", authRoute )
app.use("/pioneer-writers/v1/orders", ordersRoute)


//Server start
const PORT = process.env.PORT || 6100;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
