const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Todo Model (MongoDB Schema)
const Todo = mongoose.model("Todo", new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  status: { type: String, required: true },
}));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes

// Get all todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching todos" });
  }
});

// Create a new todo
app.post("/api/todos", async (req, res) => {
  const { firstName, lastName, status } = req.body;

  const newTodo = new Todo({
    firstName,
    lastName,
    status,
  });

  try {
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: "Error saving todo" });
  }
});

// Update a todo
app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, status } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { firstName, lastName, status },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Error updating todo" });
  }
});

// Delete a todo
app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting todo" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
