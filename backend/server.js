const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'novasmshubs',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let db;

async function initDB() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
    
    // Create tables if they don't exist
    await createTables();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

async function createTables() {
  try {
    // Users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        profile_image VARCHAR(500),
        wallet_balance DECIMAL(10,2) DEFAULT 0.00,
        status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Transactions table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        type ENUM('deposit', 'withdrawal') NOT NULL,
        gateway ENUM('paystack', 'manual', 'vpay') NOT NULL,
        reference VARCHAR(255) UNIQUE NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'complete', 'rejected') DEFAULT 'pending',
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Orders table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        country VARCHAR(100),
        service VARCHAR(100),
        number VARCHAR(20),
        price DECIMAL(10,2),
        status ENUM('pending', 'active', 'expired', 'cancelled') DEFAULT 'pending',
        order_id VARCHAR(255),
        expires_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Notifications table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('individual', 'bulk') NOT NULL,
        status ENUM('sent', 'draft', 'scheduled') DEFAULT 'draft',
        read_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log('Database tables created/verified');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Validation middleware
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Routes

// Auth routes
app.post('/api/auth/register', [
  body('name').trim().isLength({ min: 2 }),
  body('username').trim().isLength({ min: 3 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], validateRequest, async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body;

    // Check if user exists
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await db.execute(
      'INSERT INTO users (name, username, email, phone, password) VALUES (?, ?, ?, ?, ?)',
      [name, username, email, phone, hashedPassword]
    );

    const token = jwt.sign(
      { userId: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: result.insertId,
        name,
        username,
        email,
        phone
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', [
  body('email').isEmail(),
  body('password').exists()
], validateRequest, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        profileImage: user.profile_image,
        walletBalance: user.wallet_balance
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User routes
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, name, username, email, phone, profile_image, wallet_balance, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    res.json({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      profileImage: user.profile_image,
      walletBalance: parseFloat(user.wallet_balance),
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/user/profile', authenticateToken, upload.single('profileImage'), [
  body('name').trim().isLength({ min: 2 }),
  body('username').trim().isLength({ min: 3 }),
  body('email').isEmail().normalizeEmail()
], validateRequest, async (req, res) => {
  try {
    const { name, username, email, phone } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    // Check for duplicates
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?',
      [email, username, req.user.userId]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    // Update user
    let query = 'UPDATE users SET name = ?, username = ?, email = ?, phone = ?';
    let params = [name, username, email, phone];

    if (profileImage) {
      query += ', profile_image = ?';
      params.push(profileImage);
    }

    query += ' WHERE id = ?';
    params.push(req.user.userId);

    await db.execute(query, params);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Transaction routes
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const [transactions] = await db.execute(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.userId]
    );

    res.json(transactions.map(t => ({
      id: t.id,
      type: t.type,
      gateway: t.gateway,
      reference: t.reference,
      amount: parseFloat(t.amount),
      status: t.status,
      comment: t.comment,
      date: t.created_at
    })));
  } catch (error) {
    console.error('Transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/transactions', authenticateToken, [
  body('type').isIn(['deposit', 'withdrawal']),
  body('gateway').isIn(['paystack', 'manual', 'vpay']),
  body('amount').isFloat({ min: 100 }),
  body('reference').trim().isLength({ min: 1 })
], validateRequest, async (req, res) => {
  try {
    const { type, gateway, amount, reference } = req.body;

    const [result] = await db.execute(
      'INSERT INTO transactions (user_id, type, gateway, amount, reference) VALUES (?, ?, ?, ?, ?)',
      [req.user.userId, type, gateway, amount, reference]
    );

    res.status(201).json({
      message: 'Transaction created successfully',
      transactionId: result.insertId
    });
  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Paystack integration
app.post('/api/paystack/verify/:reference', authenticateToken, async (req, res) => {
  try {
    const { reference } = req.params;
    
    // Verify with Paystack API
    const axios = require('axios');
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });

    if (response.data.status && response.data.data.status === 'success') {
      const amount = response.data.data.amount / 100; // Convert from kobo to naira
      
      // Update transaction
      await db.execute(
        'UPDATE transactions SET status = ? WHERE reference = ? AND user_id = ?',
        ['complete', reference, req.user.userId]
      );

      // Update user wallet
      await db.execute(
        'UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?',
        [amount, req.user.userId]
      );

      res.json({ message: 'Payment verified successfully', amount });
    } else {
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Paystack verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Orders routes
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.userId]
    );

    res.json(orders.map(order => ({
      id: order.id,
      country: order.country,
      service: order.service,
      number: order.number,
      price: parseFloat(order.price),
      status: order.status,
      orderId: order.order_id,
      expiresAt: order.expires_at,
      date: order.created_at
    })));
  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room for balance updates
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Handle balance updates
  socket.on('balance-update', (data) => {
    // Broadcast to user's room
    socket.to(`user-${data.userId}`).emit('balance-changed', {
      newBalance: data.newBalance,
      transaction: data.transaction
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
async function startServer() {
  await initDB();
  
  server.listen(PORT, () => {
    console.log(`NovaSMSHubs Backend running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer();

module.exports = app;
