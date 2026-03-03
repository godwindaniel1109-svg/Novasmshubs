import React, { useState, useEffect } from 'react';
import { RefreshCw, DollarSign, CheckCircle, XCircle, AlertCircle, Loader, Eye, Download } from 'lucide-react';

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

  // Mock API function - replace with real API call later
  const fetchTransactions = async () => {
    setIsLoadingTransactions(true);
    setError('');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock transactions data matching your HTML structure
      const mockTransactions: Transaction[] = [
        {
          id: 1,
          date: "2026-01-04 21:48 PM",
          type: "deposit",
          gateway: "squadco",
          reference: "SQ695AD20787D658833",
          amount: 1000,
          comment: "",
          status: "pending"
        },
        {
          id: 2,
          date: "2026-01-04 21:47 PM",
          type: "deposit",
          gateway: "squadco",
          reference: "SQ695AD1EBD6C4B3915",
          amount: 1000,
          comment: "",
          status: "pending"
        },
        {
          id: 3,
          date: "2025-09-24 12:12 PM",
          type: "deposit",
          gateway: "Manual",
          reference: "M68d3d23084a2a",
          amount: 2900,
          comment: "",
          status: "complete"
        },
        {
          id: 4,
          date: "2025-07-21 21:46 PM",
          type: "deposit",
          gateway: "Paystack",
          reference: "PAY122250721094447",
          amount: 1856,
          comment: "",
          status: "complete"
        },
        {
          id: 5,
          date: "2025-07-19 18:26 PM",
          type: "deposit",
          gateway: "Paystack",
          reference: "PAY310250719062459",
          amount: 1606,
          comment: "",
          status: "complete"
        },
        {
          id: 6,
          date: "2025-05-07 16:49 PM",
          type: "deposit",
          gateway: "Manual",
          reference: "M681b810d27aeb",
          amount: 4000,
          comment: "",
          status: "complete"
        },
        {
          id: 7,
          date: "2025-05-06 13:17 PM",
          type: "deposit",
          gateway: "Manual",
          reference: "M6819fdc6938a3",
          amount: 200,
          comment: "",
          status: "complete"
        },
        {
          id: 8,
          date: "2025-05-05 11:22 AM",
          type: "deposit",
          gateway: "Manual",
          reference: "M6818915022da1",
          amount: 3000,
          comment: "Add a comment to let them know why...",
          status: "rejected"
        },
        {
          id: 9,
          date: "2025-05-05 11:15 AM",
          type: "deposit",
          gateway: "Manual",
          reference: "M68188fd0dd440",
          amount: 3000,
          comment: "Add a comment to let them know why...",
          status: "rejected"
        },
        {
          id: 10,
          date: "2025-05-05 11:12 AM",
          type: "deposit",
          gateway: "Manual",
          reference: "M68188ef2a6e8a",
          amount: 3000,
          comment: "",
          status: "complete"
        }
      ];
      
      setTransactions(mockTransactions);
      
      // Calculate total spent (only completed transactions)
      const total = mockTransactions
        .filter(t => t.status === 'complete')
        .reduce((sum, t) => sum + t.amount, 0);
      setTotalSpent(total);
      
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full';
      case 'complete':
        return 'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full';
      case 'rejected':
        return 'bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full';
      default:
        return 'bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'pending';
      case 'complete': return 'complete';
      case 'rejected': return 'rejected';
      default: return 'unknown';
    }
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

  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-4">
      {/* Header with Total Spent */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <h2 className="font-bold text-xl md:text-2xl text-gray-900 mb-4 md:mb-0">
            Your Transactions
          </h2>
          <div className="flex items-center space-x-4">
            <button className="border-2 border-nova-primary text-nova-primary bg-transparent hover:bg-nova-primary font-medium rounded-md text-sm px-4 md:px-8 py-2 text-center hover:text-white transition-colors">
              Total Spent: {formatAmount(totalSpent)}
            </button>
            <button
              onClick={fetchTransactions}
              disabled={isLoadingTransactions}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingTransactions ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50">
          <AlertCircle className="flex-shrink-0 w-4 h-4" />
          <span className="ms-3 text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3 bg-gray-50">
                  ID
                </th>
                <th className="px-6 py-3">
                  DATE
                </th>
                <th className="px-6 py-3 bg-gray-50">
                  TYPE
                </th>
                <th className="px-6 py-3">
                  GATEWAY
                </th>
                <th className="px-6 py-3 bg-gray-50">
                  REFERENCE
                </th>
                <th className="px-6 py-3">
                  AMOUNT
                </th>
                <th className="px-6 py-3">
                  COMMENT
                </th>
                <th className="px-6 py-3 bg-gray-50">
                  STATUS
                </th>
                <th className="px-6 py-3">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoadingTransactions ? (
                <tr>
                  <td colSpan={9} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <Loader className="w-6 h-6 animate-spin text-nova-primary" />
                      <span className="ml-2">Loading transactions...</span>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-200">
                    <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">
                      {transaction.id}
                    </th>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(transaction.type)}
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {transaction.gateway}
                    </td>
                    <td className="px-6 py-4 bg-gray-50">
                      <span className="font-mono text-xs">{transaction.reference}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{formatAmount(transaction.amount)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {transaction.comment ? (
                        <p className="text-sm text-gray-600 max-w-xs truncate" title={transaction.comment}>
                          {transaction.comment}
                        </p>
                      ) : (
                        <span className="text-gray-400">---</span>
                      )}
                    </td>
                    <td className="px-6 py-4 bg-gray-50">
                      <span className={getStatusBadge(transaction.status)}>
                        {getStatusText(transaction.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1 text-gray-500 hover:text-nova-primary transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-gray-500 hover:text-nova-primary transition-colors"
                          title="Download Receipt"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => t.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => t.status === 'complete').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => t.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatAmount(totalSpent)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="bg-gradient-to-r from-nova-primary/10 to-nova-secondary/10 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-6 h-6 text-nova-primary mt-1" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Transaction Summary</h4>
            <p className="text-sm text-gray-600 mb-3">
              Track all your wallet transactions including deposits, withdrawals, and payments. Monitor the status of each transaction and view detailed receipts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Completed transactions are credited to your wallet</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                <span>Pending transactions are being processed</span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span>Rejected transactions were not successful</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTransactionsPage;
