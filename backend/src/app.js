const express = require("express");
const app = express();
const errorMiddleware = require("./middleWare/error");
const requestLogger = require("./middleWare/requestLogger");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: "./config/config.env" });

// routes
const user = require("./route/userRoute");
const order = require("./route/orderRoute");
const product = require("./route/productRoute");
const payment = require("./route/paymentRoute");
const health = require("./route/healthRoute");

// request logger
if (process.env.NODE_ENV === "development" || process.env.LOG_REQUESTS === "true") {
  app.use(requestLogger);
}

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());
app.use(cors());

// API routes
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", health);

// error middleware
app.use(errorMiddleware);

// frontend path
const __dirname1 = path.resolve();

// serve frontend build
app.use(express.static(path.join(__dirname1, "frontend", "build")));

// catch-all route for React
app.use((req, res) => {
  res.sendFile(path.join(__dirname1, "frontend", "build", "index.html"));
});

module.exports = app;