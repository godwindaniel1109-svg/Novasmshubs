import React, { useState } from 'react';
import { CreditCard, Search, Filter, CheckCircle, XCircle, Clock, MoreVertical, Eye } from 'lucide-react';

interface Transaction {
  id: number;
  user: string;
  email: string;
  type: 'deposit' | 'withdrawal';
  gateway: 'paystack' | 'manual' | 'vpay';
  reference: string;
  amount: string;
  status: 'pending' | 'complete' | 'rejected';
  date: string;
  comment?: string;
}

const TransactionManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [comment, setComment] = useState('');

  const transactions: Transaction[] = [
    {
      id: 1,
      user: 'John Doe',
      email: 'john@example.com',
      type: 'deposit',
      gateway: 'paystack',
      reference: 'PAY695AD20787D658833',
      amount: '₦1,000',
      status: 'pending',
      date: '2026-01-04 21:48'
    },
    {
      id: 2,
      user: 'Jane Smith',
      email: 'jane@example.com',
      type: 'deposit',
      gateway: 'manual',
      reference: 'M68d3d23084a2a',
      amount: '₦2,900',
      status: 'complete',
      date: '2025-09-24 12:12'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      email: 'mike@example.com',
      type: 'deposit',
      gateway: 'vpay',
      reference: 'VPAY122250721094447',
      amount: '₦1,856',
      status: 'complete',
      date: '2025-07-21 21:46'
    },
    {
      id: 4,
      user: 'Sarah Williams',
      email: 'sarah@example.com',
      type: 'deposit',
      gateway: 'manual',
      reference: 'M6818915022da1',
      amount: '₦3,000',
      status: 'rejected',
      date: '2025-05-05 11:22',
      comment: 'Invalid payment proof'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: 'bg-yellow-100 text-yellow-800',
      complete: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusConfig[status as keyof typeof statusConfig]}`}>
        {status}
      </span>
    );
  };

  const getGatewayBadge = (gateway: string) => {
    const gatewayConfig = {
      paystack: 'bg-blue-100 text-blue-800',
      manual: 'bg-gray-100 text-gray-800',
      vpay: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${gatewayConfig[gateway as keyof typeof gatewayConfig]}`}>
        {gateway.toUpperCase()}
      </span>
    );
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesType = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleSelectTransaction = (transactionId: number) => {
    setSelectedTransactions(prev => 
      prev.includes(transactionId) 
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleApprove = (transaction: Transaction) => {
    console.log('Approving transaction:', transaction);
    // Implement approval logic
  };

  const handleReject = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowCommentModal(true);
  };

  const handleRejectWithComment = () => {
    if (selectedTransaction && comment) {
      console.log('Rejecting transaction:', selectedTransaction, 'with comment:', comment);
      // Implement rejection logic with comment
      setShowCommentModal(false);
      setComment('');
      setSelectedTransaction(null);
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on transactions:`, selectedTransactions);
    // Implement bulk action logic
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction Management</h1>
          <p className="text-gray-600">Review and manage all user transactions</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="px-4 py-2 bg-nova-primary text-white rounded-lg hover:bg-nova-secondary transition-colors">
            Export Transactions
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search transactions by user, email, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nova-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nova-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="complete">Complete</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nova-primary focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedTransactions.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedTransactions.length} transaction{selectedTransactions.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Approve All
              </button>
              <button 
                onClick={() => handleBulkAction('reject')}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.length === filteredTransactions.length && filteredTransactions.length > 0}
                    onChange={() => {
                      if (selectedTransactions.length === filteredTransactions.length) {
                        setSelectedTransactions([]);
                      } else {
                        setSelectedTransactions(filteredTransactions.map(t => t.id));
                      }
                    }}
                    className="rounded border-gray-300 text-nova-primary focus:ring-nova-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gateway</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.includes(transaction.id)}
                      onChange={() => handleSelectTransaction(transaction.id)}
                      className="rounded border-gray-300 text-nova-primary focus:ring-nova-primary"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{transaction.user}</div>
                      <div className="text-sm text-gray-500">{transaction.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      transaction.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getGatewayBadge(transaction.gateway)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono">{transaction.reference}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{transaction.amount}</td>
                  <td className="px-6 py-4">{getStatusBadge(transaction.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{transaction.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      {transaction.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(transaction)}
                            className="p-1 text-green-400 hover:text-green-600"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleReject(transaction)}
                            className="p-1 text-red-400 hover:text-red-600"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Comment Modal */}
      {showCommentModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Transaction</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this transaction:
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nova-primary focus:border-transparent"
                placeholder="Enter reason for rejection..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCommentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectWithComment}
                disabled={!comment}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManagementPage;
