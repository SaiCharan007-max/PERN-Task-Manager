import "dotenv/config";
import express from "express";
import "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

/* Global middleware */
app.use(express.json());

/* Health check */
app.get("/", (req, res) => {
  res.send("Server is running");
});

/* Mount auth routes */
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3137;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
