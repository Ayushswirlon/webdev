import express from "express";
import cors from "cors";

const app = express(); //app created

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
); //middleware for cors origin policy

//common middleware
app.use(express.json({ limit: "16kb" })); //json data limit
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //url encoded data limit
app.use(express.static("public")); //serve static files

//importing routes
import healthcheckRouter from "./routes/healthcheck.routes.js";

//implementing routes
app.use("/api/v1/healthcheck", healthcheckRouter);

export default app;
