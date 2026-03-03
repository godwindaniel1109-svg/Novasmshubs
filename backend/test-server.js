const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server for Socket.io
const server = createServer(app);
const io = new Server(server, { 
  cors: { origin: process.env.FRONTEND_URL || "http://localhost:3000" } 
});

// Mock data for testing
const mockTransactions = [
  {
    id: 1,
    date: "2026-01-04 21:48 PM",
    type: "deposit",
    gateway: "Paystack",
    reference: "PAY122250721094447",
    amount: 1856,
    comment: "",
    status: "complete"
  },
  {
    id: 2,
    date: "2026-01-04 21:47 PM",
    type: "deposit",
    gateway: "Paystack",
    reference: "PAY310250719062459",
    amount: 1606,
    comment: "",
    status: "complete"
  }
];

const mockStats = {
  totalUsers: 1234,
  totalRevenue: 2456789,
  pendingTransactions: 45,
  activeSessions: 89
};

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
    socket.to(`user-${data.userId}`).emit('balance-updated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Mock payment proofs data
const mockPaymentProofs = [
  {
    id: 1,
    userId: 1,
    userName: 'John Doe',
    userEmail: 'john@example.com',
    amount: 5000,
    gateway: 'manual',
    comment: 'Bank transfer to Access Bank account 1234567890',
    proofFile: 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Payment+Proof',
    proofFileName: 'payment_proof.jpg',
    status: 'pending',
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    reviewComment: null
  },
  {
    id: 2,
    userId: 2,
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    amount: 3000,
    gateway: 'card',
    comment: 'Card payment via POS machine',
    proofFile: 'https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Card+Receipt',
    proofFileName: 'card_receipt.jpg',
    status: 'pending',
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    reviewComment: null
  }
];

// Mock SMS data
const mockServices = [
  { id: 'whatsapp', name: 'WhatsApp', price: 50, count: 150 },
  { id: 'telegram', name: 'Telegram', price: 30, count: 200 },
  { id: 'instagram', name: 'Instagram', price: 40, count: 120 },
  { id: 'facebook', name: 'Facebook', price: 35, count: 180 }
];

const mockCountries = [
  { code: '0', name: 'Russia' },
  { code: '1', name: 'Ukraine' },
  { code: '2', name: 'Kazakhstan' },
  { code: '3', name: 'China' }
];

const mockOrders = [
  {
    id: '1',
    number: '+79123456789',
    service: 'WhatsApp',
    country: 'Russia',
    status: 'code_received',
    code: '123456',
    price: 50,
    createdAt: new Date().toISOString(),
    provider: '5Sim'
  }
];

// Mock banned numbers
const bannedNumbers = new Set(['+79123456790', '+79123456791']);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/transactions', (req, res) => {
  res.json({ transactions: mockTransactions });
});

app.get('/api/wallet/balance', (req, res) => {
  res.json({ balance: 5000, message: 'Balance retrieved successfully' });
});

app.post('/api/transactions/fund', (req, res) => {
  const { amount, gateway } = req.body;
  res.json({ 
    message: 'Funding request received',
    reference: `PAY${Date.now()}`,
    amount,
    gateway
  });
});

// SMS Services
app.get('/api/services', (req, res) => {
  const { country } = req.query;
  res.json({ services: mockServices });
});

app.get('/api/countries', (req, res) => {
  res.json({ countries: mockCountries });
});

app.get('/api/orders', (req, res) => {
  res.json({ orders: mockOrders });
});

// Check if number is banned
app.get('/api/numbers/check-banned/:phoneNumber', (req, res) => {
  const { phoneNumber } = req.params;
  res.json({ banned: bannedNumbers.has(phoneNumber) });
});

// Request code/OTP
app.post('/api/numbers/request-code', (req, res) => {
  const { numberId, serviceId, userId } = req.body;
  
  // Simulate code generation
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const price = mockServices.find(s => s.id === serviceId)?.price || 50;
  
  // Update order status
  const order = mockOrders.find(o => o.id === numberId);
  if (order) {
    order.status = 'code_received';
    order.code = code;
  }
  
  res.json({
    success: true,
    code,
    provider: '5Sim',
    deducted: true,
    amount: price
  });
});

// Replace banned number
app.post('/api/numbers/replace-banned', (req, res) => {
  const { numberId, userId } = req.body;
  
  // Generate new number
  const newNumber = `+79${Math.floor(Math.random() * 100000000)}`;
  
  // Update order
  const order = mockOrders.find(o => o.id === numberId);
  if (order) {
    order.number = newNumber;
    order.status = 'pending';
    order.code = undefined;
  }
  
  res.json({
    success: true,
    number: newNumber,
    id: numberId
  });
});

// Submit payment proof
app.post('/api/transactions/proof', (req, res) => {
  // In a real implementation, you would:
  // 1. Handle file upload (multer)
  // 2. Save file to storage
  // 3. Save payment proof to database
  // 4. Send notification to admin
  
  const newProof = {
    id: mockPaymentProofs.length + 1,
    userId: 1, // Get from authenticated user
    userName: 'Test User',
    userEmail: 'test@example.com',
    amount: req.body.amount,
    gateway: req.body.gateway,
    comment: req.body.comment,
    proofFile: 'https://via.placeholder.com/400x300/FF9800/FFFFFF?text=New+Proof',
    proofFileName: 'new_proof.jpg',
    status: 'pending',
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    reviewComment: null
  };
  
  mockPaymentProofs.push(newProof);
  
  res.json({ 
    message: 'Payment proof submitted successfully',
    proof: newProof
  });
});

// Get payment proofs (for admin)
app.get('/api/admin/payment-proofs', (req, res) => {
  res.json({ payments: mockPaymentProofs });
});

// Review payment proof (for admin)
app.put('/api/admin/payment-proofs/:id/review', (req, res) => {
  const { id } = req.params;
  const { action, comment } = req.body;
  
  const proofIndex = mockPaymentProofs.findIndex(p => p.id === parseInt(id));
  if (proofIndex === -1) {
    return res.status(404).json({ error: 'Payment proof not found' });
  }
  
  const proof = mockPaymentProofs[proofIndex];
  proof.status = action === 'approve' ? 'approved' : 'rejected';
  proof.reviewedAt = new Date().toISOString();
  proof.reviewedBy = 'Admin User';
  proof.reviewComment = comment;
  
  // If approved, update user balance (in real implementation)
  if (action === 'approve') {
    console.log(`User ${proof.userId} balance updated by ₦${proof.amount}`);
    // Emit socket event to update user's balance in real-time
    io.emit(`user-${proof.userId}-balance-updated`, {
      userId: proof.userId,
      amount: proof.amount,
      newBalance: 5000 + proof.amount, // Mock calculation
      type: 'deposit'
    });
  }
  
  res.json({ 
    message: `Payment ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
    proof
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready for connections`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
});
