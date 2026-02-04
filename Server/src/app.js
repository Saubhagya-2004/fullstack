import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import itemroutes from "./routes/item.routes.js";

// Load .env ONLY in local dev
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();

// ✅ Production-safe CORS
app.use(
  cors({
    origin: "*", // allow Render / Vercel frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use("/items", itemroutes);

export default app;
