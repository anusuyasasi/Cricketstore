const express = require("express");
const app = express();
const errorMiddleware = require("./middleWare/error");
const requestLogger = require("./middleWare/requestLogger");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "./config/config.env" });
}

// 1. Robust CORS Configuration
// Netlify frontend-um Render backend-um connect aaga idhu romba mukkiyam
app.use(
  cors({
    origin: "https://rad-starlight-cf31fa.netlify.app", // Unga Netlify URL
    credentials: true, // Cookies (JWT) anuppa idhu illama velaiku aagadhu
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

// 2. Standard Middlewares
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

// 3. Request Logger
if (process.env.NODE_ENV === "development" || process.env.LOG_REQUESTS === "true") {
  app.use(requestLogger);
}

// 4. Import Routes
const user = require("./route/userRoute");
const order = require("./route/orderRoute");
const product = require("./route/productRoute");
const payment = require("./route/paymentRoute");
const health = require("./route/healthRoute");

// 5. API Routes
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", health);

// 6. Root Route for Health Check (Render-la server thungama irukka)
app.get("/", (req, res) => {
  res.send("Server is Running and Healthy! 🚀");
});

// 7. Error Middleware
app.use(errorMiddleware);

module.exports = app;