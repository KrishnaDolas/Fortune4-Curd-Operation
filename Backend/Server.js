// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./Config/db");
connectDB();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());

const authRoutes = require("./Routes/authRoutes");
const recipeRoutes = require("./Routes/recipeRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/recipe", recipeRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
