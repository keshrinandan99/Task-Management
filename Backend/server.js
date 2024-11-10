const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/tasks", require("./routes/tasks.js"));
app.use("/api/todos", require("./routes/todos.js"));
app.use("/api/user", require("./routes/User.js"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
