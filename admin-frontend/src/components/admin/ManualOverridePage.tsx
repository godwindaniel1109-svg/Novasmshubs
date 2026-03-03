import React, { useState, useEffect } from 'react';
import { Settings, DollarSign, CreditCard, Phone, AlertTriangle, CheckCircle, XCircle, Search, RefreshCw, Save, User, Calendar } from 'lucide-react';
import adminApiService from '../../services/adminApi';

interface ManualOverride {
  id: string;
  type: 'balance_update' | 'transaction_update' | 'number_assignment';
  userId: string;
  username: string;
  targetId?: string;
  oldValue: any;
  newValue: any;
  reason: string;
  performedBy: string;
  performedAt: string;
  status: 'pending' | 'completed' | 'failed';
}

interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  lastLogin: string;
}

interface Transaction {
  id: string;
  userId: string;
  username: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
}

const ManualOverridePage: React.FC = () => {
  const [overrides, setOverrides] = useState<ManualOverride[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'balance' | 'transaction' | 'number' | 'history'>('balance');
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState('');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [service, setService] = useState('');
  const [reason, setReason] = useState('');

  // Load data
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (activeTab === 'history') {
        const response = await adminApiService.getManualOverrides();
        if (response.error) {
          setError(response.error);
        } else {
          setOverrides(response.overrides || []);
        }
      } else {
        // Load users and transactions for all tabs
        const [usersResponse, transactionsResponse] = await Promise.all([
          adminApiService.getUsers(),
          adminApiService.getTransactions()
        ]);

        if (usersResponse.error) {
          setError(usersResponse.error);
        } else {
          setUsers(usersResponse.users || []);
        }

        if (transactionsResponse.error) {
          setError(transactionsResponse.error);
        } else {
          setTransactions(transactionsResponse.transactions || []);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle balance update
  const handleBalanceUpdate = async () => {
    if (!selectedUser || !balanceAmount || !reason) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await adminApiService.manualBalanceUpdate(
        selectedUser,
        parseFloat(balanceAmount),
        reason
      );

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Balance updated successfully');
        setBalanceAmount('');
        setReason('');
        loadData();
      }
    } catch (error) {
      setError('Failed to update balance');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle transaction update
  const handleTransactionUpdate = async () => {
    if (!selectedTransaction || !transactionStatus || !reason) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await adminApiService.manualTransactionUpdate(
        selectedTransaction,
        transactionStatus,
        reason
      );

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Transaction updated successfully');
        setSelectedTransaction('');
        setTransactionStatus('');
        setReason('');
        loadData();
      }
    } catch (error) {
      setError('Failed to update transaction');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle number assignment
  const handleNumberAssignment = async () => {
    if (!selectedUser || !phoneNumber || !service || !reason) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await adminApiService.manualNumberAssignment(
        selectedUser,
        phoneNumber,
        service
      );

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Number assigned successfully');
        setPhoneNumber('');
        setService('');
        setReason('');
        loadData();
      }
    } catch (error) {
      setError('Failed to assign number');
    } finally {
      setIsLoading(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusConfig[status as keyof typeof statusConfig]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  // Filter data based on search
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(transaction =>
    transaction.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOverrides = overrides.filter(override =>
    override.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    override.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manual Override</h1>
            <p className="text-gray-600 mt-1">Manual system overrides and corrections</p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Warning Banner */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">⚠️ Manual Override System</p>
              <p>Use these tools only when absolutely necessary. All manual overrides are logged and monitored. Please provide clear reasons for all changes.</p>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-green-700">{success}</span>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users, transactions, or overrides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('balance')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'balance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <DollarSign className="w-4 h-4 inline mr-2" />
                Balance Update
              </button>
              <button
                onClick={() => setActiveTab('transaction')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'transaction'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <CreditCard className="w-4 h-4 inline mr-2" />
                Transaction Update
              </button>
              <button
                onClick={() => setActiveTab('number')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'number'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Number Assignment
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Override History
              </button>
            </nav>
          </div>

          {/* Balance Update Tab */}
          {activeTab === 'balance' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Balance Update</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select User
                  </label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a user</option>
                    {filteredUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username} - Current Balance: ₦{user.balance}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Balance
                  </label>
                  <input
                    type="number"
                    value={balanceAmount}
                    onChange={(e) => setBalanceAmount(e.target.value)}
                    placeholder="Enter new balance amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Update <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why this balance update is necessary..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <button
                onClick={handleBalanceUpdate}
                disabled={isLoading || !selectedUser || !balanceAmount || !reason}
                className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Update Balance
              </button>
            </div>
          )}

          {/* Transaction Update Tab */}
          {activeTab === 'transaction' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Transaction Update</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Transaction
                  </label>
                  <select
                    value={selectedTransaction}
                    onChange={(e) => setSelectedTransaction(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a transaction</option>
                    {filteredTransactions.map((transaction) => (
                      <option key={transaction.id} value={transaction.id}>
                        {transaction.username} - ₦{transaction.amount} - {transaction.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <select
                    value={transactionStatus}
                    onChange={(e) => setTransactionStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select new status</option>
                    <option value="pending">Pending</option>
                    <option value="complete">Complete</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Update <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why this transaction update is necessary..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <button
                onClick={handleTransactionUpdate}
                disabled={isLoading || !selectedTransaction || !transactionStatus || !reason}
                className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Update Transaction
              </button>
            </div>
          )}

          {/* Number Assignment Tab */}
          {activeTab === 'number' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Number Assignment</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select User
                  </label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a user</option>
                    {filteredUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service
                  </label>
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    placeholder="WhatsApp, Telegram, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Assignment <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why this manual number assignment is necessary..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <button
                onClick={handleNumberAssignment}
                disabled={isLoading || !selectedUser || !phoneNumber || !service || !reason}
                className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Assign Number
              </button>
            </div>
          )}

          {/* Override History Tab */}
          {activeTab === 'history' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Override History</h3>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600">Loading override history...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performed By</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOverrides.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                            No override history found
                          </td>
                        </tr>
                      ) : (
                        filteredOverrides.map((override) => (
                          <tr key={override.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                override.type === 'balance_update' ? 'bg-blue-100 text-blue-800' :
                                override.type === 'transaction_update' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {override.type.replace('_', ' ').toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {override.username}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div>
                                <div className="text-red-600">From: {override.oldValue}</div>
                                <div className="text-green-600">To: {override.newValue}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="max-w-xs truncate" title={override.reason}>
                                {override.reason}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {override.performedBy}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(override.performedAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(override.status)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualOverridePage;
