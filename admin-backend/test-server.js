const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for testing
const mockStats = [
  {
    title: 'Total Users',
    value: '1,234',
    change: '+12%',
    icon: 'Users',
    color: 'bg-blue-500'
  },
  {
    title: 'Total Revenue',
    value: '₦2,456,789',
    change: '+23%',
    icon: 'DollarSign',
    color: 'bg-green-500'
  },
  {
    title: 'Pending Transactions',
    value: '45',
    change: '-5%',
    icon: 'CreditCard',
    color: 'bg-yellow-500'
  },
  {
    title: 'Active Sessions',
    value: '89',
    change: '+8%',
    icon: 'Eye',
    color: 'bg-purple-500'
  }
];

const mockTransactions = [
  { id: 1, user: 'John Doe', amount: '₦1,000', type: 'deposit', status: 'pending', date: '2026-01-04 21:48' },
  { id: 2, user: 'Jane Smith', amount: '₦2,500', type: 'deposit', status: 'complete', date: '2026-01-04 21:45' },
  { id: 3, user: 'Mike Johnson', amount: '₦500', type: 'withdrawal', status: 'pending', date: '2026-01-04 21:40' },
  { id: 4, user: 'Sarah Williams', amount: '₦3,000', type: 'deposit', status: 'rejected', date: '2026-01-04 21:35' }
];

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', joined: '2026-01-04', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', joined: '2026-01-04', status: 'active' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', joined: '2026-01-03', status: 'inactive' },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', joined: '2026-01-03', status: 'active' }
];

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

// Mock SMS providers data
const mockSMSProviders = [
  {
    id: '1',
    name: '5Sim',
    baseUrl: 'https://5sim.net/v1',
    apiKey: 'test-key-5sim',
    isActive: true,
    priority: 1,
    successRate: 95,
    responseTime: 1200,
    lastChecked: new Date().toISOString()
  },
  {
    id: '2',
    name: 'SMS-Activate',
    baseUrl: 'https://sms-activate.org/stubs/handler_api.php',
    apiKey: 'test-key-sms-activate',
    isActive: true,
    priority: 2,
    successRate: 88,
    responseTime: 1500,
    lastChecked: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Virtual-Number',
    baseUrl: 'https://virtual-number.com/api',
    apiKey: 'test-key-virtual',
    isActive: false,
    priority: 3,
    successRate: 92,
    responseTime: 1000,
    lastChecked: new Date().toISOString()
  }
];

// Mock number pool data
const mockNumberPool = [
  {
    id: '1',
    number: '+79123456789',
    country: '0',
    service: 'whatsapp',
    provider: '5Sim',
    status: 'available',
    price: 50
  },
  {
    id: '2',
    number: '+79123456790',
    country: '0',
    service: 'telegram',
    provider: '5Sim',
    status: 'banned',
    price: 30
  },
  {
    id: '3',
    number: '+79123456791',
    country: '1',
    service: 'instagram',
    provider: 'SMS-Activate',
    status: 'assigned',
    assignedAt: new Date().toISOString(),
    price: 40
  }
];

// Mock SMS services data
const mockSMSServices = [
  {
    id: '1',
    name: 'WhatsApp',
    provider: '5Sim',
    country: '0',
    price: 50,
    isActive: true,
    stock: 150
  },
  {
    id: '2',
    name: 'Telegram',
    provider: 'SMS-Activate',
    country: '0',
    price: 30,
    isActive: true,
    stock: 200
  },
  {
    id: '3',
    name: 'Instagram',
    provider: '5Sim',
    country: '1',
    price: 40,
    isActive: true,
    stock: 120
  }
];

// Mock admin users data
const mockAdminUsers = [
  {
    id: '1',
    username: 'superadmin',
    email: 'super@novasmshubs.com',
    role: 'super_admin',
    permissions: {
      dashboard: true,
      users: true,
      transactions: true,
      payments: true,
      numbers: true,
      providers: true,
      reports: true,
      settings: true
    },
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '2',
    username: 'admin1',
    email: 'admin1@novasmshubs.com',
    role: 'admin',
    permissions: {
      dashboard: true,
      users: true,
      transactions: true,
      payments: true,
      numbers: true,
      providers: false,
      reports: true,
      settings: false
    },
    isActive: true,
    lastLogin: new Date(Date.now() - 86400000).toISOString(),
    createdAt: '2024-01-15T00:00:00Z',
    createdBy: '1'
  }
];

// Mock financial data
const mockFinancialStats = {
  totalRevenue: 2500000,
  totalExpenses: 800000,
  netProfit: 1700000,
  providerCosts: {
    '5Sim': 400000,
    'SMS-Activate': 250000,
    'Virtual-Number': 150000
  },
  monthlyData: [
    { month: '2024-01', revenue: 200000, expenses: 60000, users: 100, transactions: 500 },
    { month: '2024-02', revenue: 220000, expenses: 65000, users: 120, transactions: 600 },
    { month: '2024-03', revenue: 250000, expenses: 70000, users: 150, transactions: 750 }
  ],
  dailyData: [
    { date: '2024-03-01', revenue: 8000, expenses: 2300, users: 5, transactions: 25 },
    { date: '2024-03-02', revenue: 9200, expenses: 2600, users: 6, transactions: 30 },
    { date: '2024-03-03', revenue: 7500, expenses: 2100, users: 4, transactions: 22 }
  ]
};

const mockUserSpending = [
  {
    userId: '1',
    username: 'john_doe',
    email: 'john@example.com',
    totalSpent: 15000,
    monthlySpent: 3000,
    lastTransaction: new Date().toISOString()
  },
  {
    userId: '2',
    username: 'jane_smith',
    email: 'jane@example.com',
    totalSpent: 12000,
    monthlySpent: 2500,
    lastTransaction: new Date(Date.now() - 86400000).toISOString()
  }
];

const mockProviderStats = [
  {
    name: '5Sim',
    totalCost: 400000,
    totalRequests: 8000,
    successRate: 95,
    averageCost: 50,
    lastUsed: new Date().toISOString()
  },
  {
    name: 'SMS-Activate',
    totalCost: 250000,
    totalRequests: 5000,
    successRate: 88,
    averageCost: 50,
    lastUsed: new Date(Date.now() - 3600000).toISOString()
  }
];

const mockManualOverrides = [
  {
    id: '1',
    type: 'balance_update',
    userId: '1',
    username: 'john_doe',
    oldValue: 5000,
    newValue: 8000,
    reason: 'Compensation for system downtime',
    performedBy: 'superadmin',
    performedAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed'
  },
  {
    id: '2',
    type: 'transaction_update',
    userId: '2',
    username: 'jane_smith',
    targetId: 'TX123',
    oldValue: 'pending',
    newValue: 'complete',
    reason: 'Manual verification of payment proof',
    performedBy: 'admin1',
    performedAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'completed'
  }
];

// API Routes
app.get('/api/admin/health', (req, res) => {
  res.json({ status: 'OK', message: 'Admin server is running' });
});

app.get('/api/admin/dashboard/stats', (req, res) => {
  res.json({ 
    stats: mockStats,
    recentTransactions: mockTransactions,
    recentUsers: mockUsers
  });
});

app.get('/api/admin/users', (req, res) => {
  res.json({ users: mockUsers });
});

app.get('/api/admin/transactions', (req, res) => {
  res.json({ transactions: mockTransactions });
});

// Admin User Management
app.get('/api/admin/admin-users', (req, res) => {
  res.json({ admins: mockAdminUsers });
});

app.post('/api/admin/admin-users', (req, res) => {
  const newAdmin = {
    id: (mockAdminUsers.length + 1).toString(),
    ...req.body,
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    createdBy: '1'
  };
  
  mockAdminUsers.push(newAdmin);
  
  res.json({ 
    message: 'Admin user created successfully',
    admin: newAdmin
  });
});

app.put('/api/admin/admin-users/:id', (req, res) => {
  const { id } = req.params;
  const adminIndex = mockAdminUsers.findIndex(a => a.id === id);
  
  if (adminIndex === -1) {
    return res.status(404).json({ error: 'Admin user not found' });
  }
  
  mockAdminUsers[adminIndex] = { ...mockAdminUsers[adminIndex], ...req.body };
  
  res.json({ 
    message: 'Admin user updated successfully',
    admin: mockAdminUsers[adminIndex]
  });
});

app.delete('/api/admin/admin-users/:id', (req, res) => {
  const { id } = req.params;
  const adminIndex = mockAdminUsers.findIndex(a => a.id === id);
  
  if (adminIndex === -1) {
    return res.status(404).json({ error: 'Admin user not found' });
  }
  
  mockAdminUsers.splice(adminIndex, 1);
  
  res.json({ message: 'Admin user deleted successfully' });
});

app.put('/api/admin/admin-users/:id/toggle', (req, res) => {
  const { id } = req.params;
  const adminIndex = mockAdminUsers.findIndex(a => a.id === id);
  
  if (adminIndex === -1) {
    return res.status(404).json({ error: 'Admin user not found' });
  }
  
  mockAdminUsers[adminIndex].isActive = !mockAdminUsers[adminIndex].isActive;
  
  res.json({ 
    message: 'Admin user status updated successfully',
    admin: mockAdminUsers[adminIndex]
  });
});

// Financial Management
app.get('/api/admin/financial/stats', (req, res) => {
  const { range } = req.query;
  res.json({ 
    stats: mockFinancialStats,
    userSpending: mockUserSpending,
    providerStats: mockProviderStats
  });
});

app.get('/api/admin/financial/export', (req, res) => {
  const { range } = req.query;
  
  // Mock CSV data
  const csvData = 'Date,Revenue,Expenses,Users,Transactions\n2024-03-01,8000,2300,5,25\n2024-03-02,9200,2600,6,30\n2024-03-03,7500,2100,4,22';
  
  res.json({ data: csvData });
});

// Manual Override System
app.get('/api/admin/manual-overrides', (req, res) => {
  res.json({ overrides: mockManualOverrides });
});

app.post('/api/admin/manual/balance-update', (req, res) => {
  const { userId, amount, reason } = req.body;
  
  const newOverride = {
    id: (mockManualOverrides.length + 1).toString(),
    type: 'balance_update',
    userId,
    username: 'test_user',
    oldValue: 5000,
    newValue: amount,
    reason,
    performedBy: 'admin',
    performedAt: new Date().toISOString(),
    status: 'completed'
  };
  
  mockManualOverrides.push(newOverride);
  
  res.json({ 
    message: 'Balance updated successfully',
    override: newOverride
  });
});

app.post('/api/admin/manual/transaction-update', (req, res) => {
  const { transactionId, status, reason } = req.body;
  
  const newOverride = {
    id: (mockManualOverrides.length + 1).toString(),
    type: 'transaction_update',
    userId: '1',
    username: 'test_user',
    targetId: transactionId,
    oldValue: 'pending',
    newValue: status,
    reason,
    performedBy: 'admin',
    performedAt: new Date().toISOString(),
    status: 'completed'
  };
  
  mockManualOverrides.push(newOverride);
  
  res.json({ 
    message: 'Transaction updated successfully',
    override: newOverride
  });
});

app.post('/api/admin/manual/number-assignment', (req, res) => {
  const { userId, number, service } = req.body;
  
  const newOverride = {
    id: (mockManualOverrides.length + 1).toString(),
    type: 'number_assignment',
    userId,
    username: 'test_user',
    oldValue: 'none',
    newValue: number,
    reason: `Manual assignment for ${service}`,
    performedBy: 'admin',
    performedAt: new Date().toISOString(),
    status: 'completed'
  };
  
  mockManualOverrides.push(newOverride);
  
  res.json({ 
    message: 'Number assigned successfully',
    override: newOverride
  });
});

// Dynamic 5Sim Integration
app.get('/api/admin/dynamic/services', (req, res) => {
  const { country, search } = req.query;
  
  // Mock dynamic services from 5Sim
  const dynamicServices = [
    { id: 'whatsapp', name: 'WhatsApp', price: 50, count: 150 },
    { id: 'telegram', name: 'Telegram', price: 30, count: 200 },
    { id: 'instagram', name: 'Instagram', price: 40, count: 120 },
    { id: 'facebook', name: 'Facebook', price: 35, count: 180 }
  ].filter(service => 
    search ? service.name.toLowerCase().includes(search.toString().toLowerCase()) : true
  );
  
  res.json({ services: dynamicServices });
});

app.get('/api/admin/dynamic/countries', (req, res) => {
  const { search } = req.query;
  
  // Mock dynamic countries from 5Sim
  const dynamicCountries = [
    { code: '0', name: 'Russia' },
    { code: '1', name: 'Ukraine' },
    { code: '2', name: 'Kazakhstan' },
    { code: '3', name: 'China' },
    { code: '4', name: 'United Kingdom' },
    { code: '5', name: 'United States' }
  ].filter(country => 
    search ? country.name.toLowerCase().includes(search.toString().toLowerCase()) : true
  );
  
  res.json({ countries: dynamicCountries });
});

app.get('/api/admin/dynamic/numbers', (req, res) => {
  const { service, country } = req.query;
  
  // Mock dynamic numbers from 5Sim
  const dynamicNumbers = [
    { id: '1', number: '+79123456789', price: 50, provider: '5Sim' },
    { id: '2', number: '+79123456790', price: 50, provider: '5Sim' },
    { id: '3', number: '+79123456791', price: 50, provider: '5Sim' }
  ];
  
  res.json({ numbers: dynamicNumbers });
});

// Payment Proof Management
app.get('/api/admin/payment-proofs', (req, res) => {
  res.json({ payments: mockPaymentProofs });
});

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
  
  console.log(`Payment proof ${id} ${action} by admin`);
  
  res.json({ 
    message: `Payment ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
    proof
  });
});

// SMS Provider Management
app.get('/api/admin/sms-providers', (req, res) => {
  res.json({ providers: mockSMSProviders });
});

app.post('/api/admin/sms-providers', (req, res) => {
  const newProvider = {
    id: (mockSMSProviders.length + 1).toString(),
    ...req.body,
    successRate: 0,
    responseTime: 0,
    lastChecked: new Date().toISOString()
  };
  
  mockSMSProviders.push(newProvider);
  
  res.json({ 
    message: 'SMS provider created successfully',
    provider: newProvider
  });
});

app.put('/api/admin/sms-providers/:id', (req, res) => {
  const { id } = req.params;
  const providerIndex = mockSMSProviders.findIndex(p => p.id === id);
  
  if (providerIndex === -1) {
    return res.status(404).json({ error: 'SMS provider not found' });
  }
  
  mockSMSProviders[providerIndex] = { ...mockSMSProviders[providerIndex], ...req.body };
  
  res.json({ 
    message: 'SMS provider updated successfully',
    provider: mockSMSProviders[providerIndex]
  });
});

app.delete('/api/admin/sms-providers/:id', (req, res) => {
  const { id } = req.params;
  const providerIndex = mockSMSProviders.findIndex(p => p.id === id);
  
  if (providerIndex === -1) {
    return res.status(404).json({ error: 'SMS provider not found' });
  }
  
  mockSMSProviders.splice(providerIndex, 1);
  
  res.json({ message: 'SMS provider deleted successfully' });
});

app.put('/api/admin/sms-providers/:id/toggle', (req, res) => {
  const { id } = req.params;
  const providerIndex = mockSMSProviders.findIndex(p => p.id === id);
  
  if (providerIndex === -1) {
    return res.status(404).json({ error: 'SMS provider not found' });
  }
  
  mockSMSProviders[providerIndex].isActive = !mockSMSProviders[providerIndex].isActive;
  
  res.json({ 
    message: 'SMS provider status updated successfully',
    provider: mockSMSProviders[providerIndex]
  });
});

// Number Pool Management
app.get('/api/admin/number-pool', (req, res) => {
  res.json({ numbers: mockNumberPool });
});

app.post('/api/admin/number-pool/add', (req, res) => {
  const { numbers, provider } = req.body;
  
  const newNumbers = numbers.map((number, index) => ({
    id: (mockNumberPool.length + index + 1).toString(),
    number,
    country: '0',
    service: 'general',
    provider,
    status: 'available',
    price: 50
  }));
  
  mockNumberPool.push(...newNumbers);
  
  res.json({ 
    message: 'Numbers added to pool successfully',
    numbers: newNumbers
  });
});

// SMS Services Management
app.get('/api/admin/sms-services', (req, res) => {
  res.json({ services: mockSMSServices });
});

app.post('/api/admin/sms-services', (req, res) => {
  const newService = {
    id: (mockSMSServices.length + 1).toString(),
    ...req.body,
    stock: 0
  };
  
  mockSMSServices.push(newService);
  
  res.json({ 
    message: 'SMS service created successfully',
    service: newService
  });
});

app.put('/api/admin/sms-services/:id', (req, res) => {
  const { id } = req.params;
  const serviceIndex = mockSMSServices.findIndex(s => s.id === id);
  
  if (serviceIndex === -1) {
    return res.status(404).json({ error: 'SMS service not found' });
  }
  
  mockSMSServices[serviceIndex] = { ...mockSMSServices[serviceIndex], ...req.body };
  
  res.json({ 
    message: 'SMS service updated successfully',
    service: mockSMSServices[serviceIndex]
  });
});

app.delete('/api/admin/sms-services/:id', (req, res) => {
  const { id } = req.params;
  const serviceIndex = mockSMSServices.findIndex(s => s.id === id);
  
  if (serviceIndex === -1) {
    return res.status(404).json({ error: 'SMS service not found' });
  }
  
  mockSMSServices.splice(serviceIndex, 1);
  
  res.json({ message: 'SMS service deleted successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Admin test server running on port ${PORT}`);
  console.log(`🌐 Admin API available at http://localhost:${PORT}`);
});
