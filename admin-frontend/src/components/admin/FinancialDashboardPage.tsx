import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Users, Calendar, Filter, Download, RefreshCw, AlertCircle, CheckCircle, BarChart3, PieChart, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import adminApiService from '../../services/adminApi';

interface FinancialStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  providerCosts: {
    '5Sim': number;
    'SMS-Activate': number;
    'Virtual-Number': number;
  };
  monthlyData: {
    month: string;
    revenue: number;
    expenses: number;
    users: number;
    transactions: number;
  }[];
  dailyData: {
    date: string;
    revenue: number;
    expenses: number;
    users: number;
    transactions: number;
  }[];
}

interface UserSpending {
  userId: string;
  username: string;
  email: string;
  totalSpent: number;
  monthlySpent: number;
  lastTransaction: string;
}

interface ProviderStats {
  name: string;
  totalCost: number;
  totalRequests: number;
  successRate: number;
  averageCost: number;
  lastUsed: string;
}

const FinancialDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [userSpending, setUserSpending] = useState<UserSpending[]>([]);
  const [providerStats, setProviderStats] = useState<ProviderStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');

  // Load financial data
  useEffect(() => {
    loadFinancialData();
  }, [dateRange, viewMode]);

  const loadFinancialData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await adminApiService.getFinancialStats(dateRange);
      if (response.error) {
        setError(response.error);
      } else {
        setStats(response.stats);
        setUserSpending(response.userSpending || []);
        setProviderStats(response.providerStats || []);
      }
    } catch (error) {
      console.error('Error loading financial data:', error);
      setError('Failed to load financial data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Export financial data
  const exportData = async () => {
    try {
      const response = await adminApiService.exportFinancialData(dateRange);
      if (response.error) {
        setError(response.error);
      } else {
        // Create download link
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financial-report-${dateRange}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      setError('Failed to export data');
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get trend icon
  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    } else if (current < previous) {
      return <ArrowDownRight className="w-4 h-4 text-red-500" />;
    }
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  // Get trend color
  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-gray-600';
  };

  // Calculate percentage change
  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
            <p className="text-gray-600 mt-1">Track revenue, expenses, and provider costs</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <button
              onClick={exportData}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button
              onClick={loadFinancialData}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
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

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading financial data...</span>
          </div>
        ) : stats ? (
          <>
            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                    <p className="text-sm text-green-600 mt-2">+12.5% from last period</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalExpenses)}</p>
                    <p className="text-sm text-red-600 mt-2">+8.3% from last period</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Net Profit</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.netProfit)}</p>
                    <p className="text-sm text-green-600 mt-2">+18.7% from last period</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">1,234</p>
                    <p className="text-sm text-green-600 mt-2">+5.2% from last period</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Costs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Costs</h3>
                <div className="space-y-4">
                  {Object.entries(stats.providerCosts).map(([provider, cost]) => (
                    <div key={provider} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          <CreditCard className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{provider}</p>
                          <p className="text-sm text-gray-600">SMS Provider</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(cost)}</p>
                        <p className="text-sm text-gray-600">Total cost</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Performance</h3>
                <div className="space-y-4">
                  {providerStats.map((provider) => (
                    <div key={provider.name} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{provider.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          provider.successRate > 90 ? 'bg-green-100 text-green-800' :
                          provider.successRate > 80 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {provider.successRate}% Success
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total Requests</p>
                          <p className="font-medium">{provider.totalRequests.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Avg Cost</p>
                          <p className="font-medium">{formatCurrency(provider.averageCost)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Revenue & Expenses</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('daily')}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setViewMode('monthly')}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Revenue chart visualization</p>
                  <p className="text-sm text-gray-500">Chart integration would go here</p>
                </div>
              </div>
            </div>

            {/* Top Users by Spending */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Top Users by Spending</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Spent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Transaction</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userSpending.slice(0, 10).map((user) => (
                      <tr key={user.userId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(user.totalSpent)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(user.monthlySpent)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.lastTransaction).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default FinancialDashboardPage;
