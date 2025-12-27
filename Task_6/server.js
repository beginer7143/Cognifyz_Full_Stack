// ===== server.js =====
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();

// ====== CONFIG ======
const PORT = 3000;
const JWT_SECRET = 'secretkey123'; // In production, use env variable
const MONGO_URI = 'mongodb://127.0.0.1:27017/formApp'; // change if using Atlas

// ====== MIDDLEWARE ======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// ====== MONGOOSE SETUP ======
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// ====== SCHEMAS ======
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  userId: mongoose.Schema.Types.ObjectId
});

const User = mongoose.model('User', userSchema);
const FormData = mongoose.model('FormData', formSchema);

// ====== AUTH MIDDLEWARE ======
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: "No token provided" });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.userId = decoded.id;
    next();
  });
}

// ====== ROUTES ======

// Register new user
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();
  res.json({ message: "User registered successfully" });
});

// Login user
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: "Login successful", token });
});

// Protected route — Save form data
app.post('/api/form', verifyToken, async (req, res) => {
  const { name, email, message } = req.body;
  const newData = new FormData({ name, email, message, userId: req.userId });
  await newData.save();
  res.json({ message: "Form data saved!" });
});

// Protected route — Get user’s form submissions
app.get('/api/form', verifyToken, async (req, res) => {
  const data = await FormData.find({ userId: req.userId });
  res.json(data);
});

// Serve HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ====== START SERVER ======
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
