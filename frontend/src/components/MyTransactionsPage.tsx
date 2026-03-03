import React, { useState, useEffect } from 'react';
import { RefreshCw, DollarSign, CheckCircle, XCircle, AlertCircle, Loader, Eye, Download } from 'lucide-react';
import apiService from '../services/api';
import { initializeSocket } from '../services/api';

interface Transaction {
  id: number;
  date: string;
  type: string;
  gateway: string;
  reference: string;
  amount: number;
  comment: string;
  status: string; // pending, complete, rejected
}

const MyTransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [error, setError] = useState('');
  const [totalSpent, setTotalSpent] = useState(0);

  // Real API function for fetching transactions
  const fetchTransactions = async () => {
    setIsLoadingTransactions(true);
    setError('');
    try {
      const response = await apiService.getTransactions();
      
      if (response.error) {
        setError(response.error);
      } else {
        setTransactions(response.transactions || []);
        
        // Calculate total spent (only completed transactions)
        const total = (response.transactions || [])
          .filter((t: Transaction) => t.status === 'complete')
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
        setTotalSpent(total);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  // Initialize socket connection for real-time updates
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      initializeSocket(user.id);
    }

    // Listen for balance updates
    const handleBalanceUpdate = (event: any) => {
      console.log('Balance update received:', event.detail);
      // Refresh transactions when balance changes
      fetchTransactions();
    };

    window.addEventListener('balance-updated', handleBalanceUpdate);

    return () => {
      window.removeEventListener('balance-updated', handleBalanceUpdate);
    };
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, []);

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
      manual: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${gatewayConfig[gateway as keyof typeof gatewayConfig]}`}>
        {gateway.toUpperCase()}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'withdrawal':
        return <DollarSign className="w-4 h-4 text-red-500" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-blue-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoadingTransactions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading transactions...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Transactions</h1>
            <p className="text-gray-600 mt-1">View your transaction history</p>
          </div>
          <button
            onClick={fetchTransactions}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">₦{totalSpent.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {transactions.filter(t => t.status === 'complete').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gateway
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{transaction.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          {getTypeIcon(transaction.type)}
                          <span className="ml-2 capitalize">{transaction.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getGatewayBadge(transaction.gateway)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₦{transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTransactionsPage;
