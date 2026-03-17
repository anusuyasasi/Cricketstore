const express = require("express");
const app = express();
const errorMiddleware = require("./middleWare/error");
const requestLogger = require("./middleWare/requestLogger");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: "./config/config.env" });

// Middlewares - CORS-ஐ மற்ற Routes-க்கு முன்பே போட வேண்டும்
app.use(
  cors({
    origin: "https://grand-swan-9a8e78.netlify.app", // உங்கள் லோக்கல் ஹோஸ்ட் போர்ட் 3000 என்றால் இது சரி
    credentials: true,               // Cookies அனுப்ப இது மிக அவசியம்
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(fileUpload());

// Request Logger
if (process.env.NODE_ENV === "development" || process.env.LOG_REQUESTS === "true") {
  app.use(requestLogger);
}

// Routes
const user = require("./route/userRoute");
const order = require("./route/orderRoute");
const product = require("./route/productRoute");
const payment = require("./route/paymentRoute");
const health = require("./route/healthRoute");

// API Routes
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", health);

// Error Middleware (always last)
app.use(errorMiddleware);

module.exports = app;