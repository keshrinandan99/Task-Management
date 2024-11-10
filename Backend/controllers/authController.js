const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Temporary in-memory user database
let users = [];

// Sign-up route
app.post('/signup', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Check if user already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // Validate password and confirm password
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = { name, email, password: hashedPassword };
    users.push(newUser);

    // Generate a JWT token
    const token = generateToken(newUser);

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Sign-in route
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  // Find the user
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  try {
    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = generateToken(user);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error signing in' });
  }
});

// Helper function to generate a JWT token
function generateToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, 'mysecretkey', {
    expiresIn: '1h',
  });
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});