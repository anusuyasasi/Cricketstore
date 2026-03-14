const express = require("express");
const app = express();
const errorMiddleware = require("./middleWare/error");
const requestLogger = require("./middleWare/requestLogger");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: "./config/config.env" });

// Routes
const user = require("./route/userRoute");
const order = require("./route/orderRoute");
const product = require("./route/productRoute");
const payment = require("./route/paymentRoute");
const health = require("./route/healthRoute");

// Request Logger
if (process.env.NODE_ENV === "development" || process.env.LOG_REQUESTS === "true") {
  app.use(requestLogger);
}

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(fileUpload());
app.use(cors());

// API Routes
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", health);

// Frontend build path
const __dirname1 = path.resolve();

// Serve React build files
app.use(express.static(path.join(__dirname1, "../frontend/build")));

// React routing fix
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname1, "../frontend/build/index.html"));
});

// Error Middleware (always last)
app.use(errorMiddleware);

module.exports = app;