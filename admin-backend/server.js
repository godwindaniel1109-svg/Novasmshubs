const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.ADMIN_PORT || 5001;

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
app.use('/api/admin/', limiter);

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

// Database connection (same database as main backend)
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
    console.log('Connected to MySQL database (Admin Backend)');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

// Admin JWT middleware
function authenticateAdminToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Admin access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid admin token' });
    }
    req.admin = admin;
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

// Admin auth routes
app.post('/api/admin/auth/login', [
  body('email').isEmail(),
  body('password').exists()
], validateRequest, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if it's admin credentials
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { 
          adminId: 'admin', 
          email: email,
          role: 'super_admin'
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        message: 'Admin login successful',
        token,
        admin: {
          id: 'admin',
          email: email,
          name: 'Admin User',
          role: 'Super Admin'
        }
      });
    }

    // Check database admin users
    const [admins] = await db.execute(
      'SELECT * FROM admin_users WHERE email = ?',
      [email]
    );

    if (admins.length === 0) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const admin = admins[0];
    const validPassword = await bcrypt.compare(password, admin.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { 
        adminId: admin.id, 
        email: admin.email,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dashboard stats
app.get('/api/admin/dashboard/stats', authenticateAdminToken, async (req, res) => {
  try {
    // Get total users
    const [userCount] = await db.execute('SELECT COUNT(*) as total FROM users');
    
    // Get total revenue
    const [revenue] = await db.execute(
      'SELECT SUM(amount) as total FROM transactions WHERE status = ? AND type = ?',
      ['complete', 'deposit']
    );
    
    // Get pending transactions
    const [pendingTransactions] = await db.execute(
      'SELECT COUNT(*) as total FROM transactions WHERE status = ?',
      ['pending']
    );
    
    // Get active sessions (simplified - users who joined in last 24 hours)
    const [activeSessions] = await db.execute(
      'SELECT COUNT(*) as total FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)'
    );

    res.json({
      totalUsers: userCount[0].total,
      totalRevenue: parseFloat(revenue[0].total) || 0,
      pendingTransactions: pendingTransactions[0].total,
      activeSessions: activeSessions[0].total
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User management
app.get('/api/admin/users', authenticateAdminToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = 'all' } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, name, username, email, phone, wallet_balance, status, created_at FROM users WHERE 1=1';
    let params = [];

    if (search) {
      query += ' AND (name LIKE ? OR username LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [users] = await db.execute(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    let countParams = [];

    if (search) {
      countQuery += ' AND (name LIKE ? OR username LIKE ? OR email LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status !== 'all') {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const [countResult] = await db.execute(countQuery, countParams);

    res.json({
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        balance: parseFloat(user.wallet_balance),
        status: user.status,
        joined: user.created_at
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Users list error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/users/:id/status', authenticateAdminToken, [
  body('status').isIn(['active', 'inactive', 'suspended'])
], validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.execute(
      'UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    res.json({ message: `User status updated to ${status}` });
  } catch (error) {
    console.error('User status update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Transaction management
app.get('/api/admin/transactions', authenticateAdminToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all', type = 'all' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT t.*, u.name, u.email 
      FROM transactions t 
      JOIN users u ON t.user_id = u.id 
      WHERE 1=1
    `;
    let params = [];

    if (status !== 'all') {
      query += ' AND t.status = ?';
      params.push(status);
    }

    if (type !== 'all') {
      query += ' AND t.type = ?';
      params.push(type);
    }

    query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [transactions] = await db.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM transactions t WHERE 1=1';
    let countParams = [];

    if (status !== 'all') {
      countQuery += ' AND t.status = ?';
      countParams.push(status);
    }

    if (type !== 'all') {
      countQuery += ' AND t.type = ?';
      countParams.push(type);
    }

    const [countResult] = await db.execute(countQuery, countParams);

    res.json({
      transactions: transactions.map(t => ({
        id: t.id,
        user: t.name,
        email: t.email,
        type: t.type,
        gateway: t.gateway,
        reference: t.reference,
        amount: parseFloat(t.amount),
        status: t.status,
        comment: t.comment,
        date: t.created_at
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Admin transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/transactions/:id/approve', authenticateAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get transaction details
    const [transactions] = await db.execute(
      'SELECT * FROM transactions WHERE id = ?',
      [id]
    );

    if (transactions.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = transactions[0];

    if (transaction.status !== 'pending') {
      return res.status(400).json({ error: 'Transaction is not pending' });
    }

    // Update transaction status
    await db.execute(
      'UPDATE transactions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['complete', id]
    );

    // Update user wallet balance for deposits
    if (transaction.type === 'deposit') {
      await db.execute(
        'UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?',
        [transaction.amount, transaction.user_id]
      );
    }

    res.json({ message: 'Transaction approved successfully' });
  } catch (error) {
    console.error('Transaction approval error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/transactions/:id/reject', authenticateAdminToken, [
  body('comment').trim().isLength({ min: 1 })
], validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    // Update transaction status
    await db.execute(
      'UPDATE transactions SET status = ?, comment = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['rejected', comment, id]
    );

    res.json({ message: 'Transaction rejected successfully' });
  } catch (error) {
    console.error('Transaction rejection error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Notifications
app.get('/api/admin/notifications', authenticateAdminToken, async (req, res) => {
  try {
    const [notifications] = await db.execute(
      'SELECT * FROM notifications ORDER BY created_at DESC'
    );

    res.json(notifications.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      recipient: n.user_id ? `User ${n.user_id}` : 'All Users',
      status: n.status,
      readCount: n.read_count,
      date: n.created_at
    })));
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/notifications', authenticateAdminToken, [
  body('title').trim().isLength({ min: 1 }),
  body('message').trim().isLength({ min: 1 }),
  body('type').isIn(['individual', 'bulk']),
  body('userIds').optional().isArray()
], validateRequest, async (req, res) => {
  try {
    const { title, message, type, userIds } = req.body;

    if (type === 'individual' && (!userIds || userIds.length === 0)) {
      return res.status(400).json({ error: 'User IDs required for individual notifications' });
    }

    // Create notification
    const [result] = await db.execute(
      'INSERT INTO notifications (user_id, title, message, type, status) VALUES (?, ?, ?, ?, ?)',
      [type === 'bulk' ? null : userIds[0], title, message, type, 'sent']
    );

    res.status(201).json({
      message: 'Notification sent successfully',
      notificationId: result.insertId
    });
  } catch (error) {
    console.error('Notification creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin profile management
app.get('/api/admin/profile', authenticateAdminToken, async (req, res) => {
  try {
    // For demo, return static admin profile
    res.json({
      id: 'admin',
      name: 'Admin User',
      username: 'admin',
      email: 'admin@novasmshubs.com',
      role: 'Super Admin',
      profileImage: '/images/admin-avatar.png',
      createdAt: '2024-01-01'
    });
  } catch (error) {
    console.error('Admin profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/profile', authenticateAdminToken, upload.single('profileImage'), [
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail()
], validateRequest, async (req, res) => {
  try {
    const { name, email } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    // In a real implementation, you would update admin_users table
    // For demo, we'll just return success
    res.json({ 
      message: 'Admin profile updated successfully',
      profileImage: profileImage 
    });
  } catch (error) {
    console.error('Admin profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/admin/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'NovaSMSHubs Admin Backend',
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
  res.status(404).json({ error: 'Admin route not found' });
});

// Start server
async function startServer() {
  await initDB();
  
  app.listen(PORT, () => {
    console.log(`NovaSMSHubs Admin Backend running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/admin/health`);
  });
}

startServer();

module.exports = app;
