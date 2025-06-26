const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5001;
const SECRET_KEY = "your-very-secret-key-123"; // Change this!

// Mock "database" (arrays)
let users = [ {
    username: "admin", 
    password: bcrypt.hashSync("admin123", 10) // Auto-hashed
  }];
let songs = [
  { id: 1, title: "Bohemian Rhapsody", artist: "Queen" },
  { id: 2, title: "Blinding Lights", artist: "The Weeknd" }
];

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Root route (fixes "Cannot GET /")
app.get('/', (req, res) => {
  res.json({
    status: 'Backend is running!',
    endpoints: {
      register: 'POST /api/register',
      login: 'POST /api/login',
      getSongs: 'GET /api/songs',
      addSong: 'POST /api/songs'
    }
  });
});

// 🔐 Auth Routes
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  
  // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  // Check if user exists
  if (users.some(u => u.username === username)) {
    return res.status(400).json({ error: "Username already taken" });
  }

  // Hash password and save user
  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ username, password: hashedPassword });
  
  res.status(201).json({ message: "User registered successfully!" });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  // Validate credentials
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Generate JWT token
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// 🎵 Song Routes
app.get('/api/songs', (req, res) => {
  res.json(songs);
});

app.post('/api/songs', (req, res) => {
  const { title, artist } = req.body;
  
  if (!title || !artist) {
    return res.status(400).json({ error: "Title and artist required" });
  }

  const newSong = { 
    id: Date.now(), // Simple unique ID
    title, 
    artist 
  };
  
  songs.push(newSong);
  res.status(201).json(newSong);
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`
  ⚡ Backend running on http://localhost:${PORT}
  📄 API Documentation:
     - Test: curl http://localhost:${PORT}
     - Register: curl -X POST http://localhost:${PORT}/api/register -H "Content-Type: application/json" -d '{"username":"test","password":"test"}'
     - Get Songs: curl http://localhost:${PORT}/api/songs
  `);
});