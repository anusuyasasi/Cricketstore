const express = require("express");
const app = express();
const errorMiddleware = require("./middleWare/error");
const requestLogger = require("./middleWare/requestLogger");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: "./config/config.env" });

// --- CORS Configuration ---
// இங்கே உங்கள் Localhost மற்றும் Vercel URL இரண்டையும் அனுமதிக்கும்படி மாற்றப்பட்டுள்ளது
const allowedOrigins = [
  "http://localhost:3000",
  "https://cricket-weapon-store.vercel.app" // உங்கள் Vercel URL-ஐ இங்கே மாற்றிக்கொள்ளுங்கள்
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Origin இல்லாமலோ (eg: Postman) அல்லது அனுமதிக்கப்பட்ட லிஸ்டில் இருந்தாலோ அனுமதி கொடு
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Cookies அனுப்ப இது மிக அவசியம்
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --- Middlewares ---
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(fileUpload());

// Request Logger
if (process.env.NODE_ENV === "development" || process.env.LOG_REQUESTS === "true") {
  app.use(requestLogger);
}

// --- Routes Imports ---
const user = require("./route/userRoute");
const order = require("./route/orderRoute");
const product = require("./route/productRoute");
const payment = require("./route/paymentRoute");
const health = require("./route/healthRoute");

// --- API Routes ---
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", health);

// --- Deployment Config (Static Files) ---
// ஒருவேளை நீங்கள் Backend-லேயே Frontend-ஐயும் ஹோஸ்ட் செய்தால் இது தேவைப்படும்
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

// Error Middleware (always last)
app.use(errorMiddleware);

module.exports = app;