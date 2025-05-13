const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Enable CORS for all requests
app.use(cors());
app.use(bodyParser.json());

// In-memory user store (for demo only)
let users = [];

// Registration endpoint
app.post('/register', (req, res) => {
  const { cardNumber, password } = req.body;

  // Basic validation
  if (!cardNumber || !password) {
    return res.status(400).json({ message: 'Card Number and Password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  // Check if user already exists
  const existingUser = users.find(u => u.cardNumber === cardNumber);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  // Save user (in-memory, plain password for demo)
  users.push({ cardNumber, password });
  res.status(201).json({ message: 'User registered successfully' });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { cardNumber, password } = req.body;

  // Basic validation
  if (!cardNumber || !password) {
    return res.status(400).json({ message: 'Card Number and Password are required' });
  }

  // Find user
  const user = users.find(u => u.cardNumber === cardNumber && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // For demo, return user info (never send password in real apps)
  res.status(200).json({ 
    message: 'Login successful', 
    user: { cardNumber: user.cardNumber }
  });
});

// Optional: Get all users (for testing/demo only, remove in production)
app.get('/users', (req, res) => {
  res.json(users.map(u => ({ cardNumber: u.cardNumber })));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
