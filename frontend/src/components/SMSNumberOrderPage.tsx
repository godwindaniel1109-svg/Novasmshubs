import React, { useState, useEffect } from 'react';
import { Phone, RefreshCw, AlertCircle, CheckCircle, XCircle, Loader, CreditCard, Ban, Replace, Eye, Copy } from 'lucide-react';
import smsService from '../services/smsService';
import apiService from '../services/api';

interface Service {
  id: string;
  name: string;
  price: number;
  count: number;
}

interface Country {
  code: string;
  name: string;
}

interface NumberOrder {
  id: string;
  number: string;
  service: string;
  country: string;
  status: 'pending' | 'code_received' | 'completed' | 'banned' | 'failed';
  code?: string;
  price: number;
  createdAt: string;
  provider?: string;
}

const SMSNumberOrderPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [orders, setOrders] = useState<NumberOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<NumberOrder | null>(null);
  const [codeInput, setCodeInput] = useState('');

  // Load initial data
  useEffect(() => {
    loadServices();
    loadCountries();
    loadWalletBalance();
    loadOrders();
  }, []);

  const loadServices = async () => {
    try {
      const services = await smsService.getServices(selectedCountry || '0');
      setServices(services);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const loadCountries = async () => {
    try {
      const countries = await smsService.getCountries();
      setCountries(countries);
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  };

  const loadWalletBalance = async () => {
    try {
      const response = await apiService.getWalletBalance();
      if (response.balance !== undefined) {
        setWalletBalance(response.balance);
      }
    } catch (error) {
      console.error('Error loading wallet balance:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await apiService.getOrders();
      if (response.orders) {
        setOrders(response.orders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  // Request number
  const requestNumber = async () => {
    if (!selectedService || !selectedCountry) {
      setError('Please select service and country');
      return;
    }

    const service = services.find(s => s.id === selectedService);
    if (!service) {
      setError('Invalid service selected');
      return;
    }

    if (walletBalance < service.price) {
      setError(`Insufficient balance. You need ₦${service.price} but have ₦${walletBalance}`);
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await smsService.requestNumber({
        serviceId: selectedService,
        country: selectedCountry,
        userId: '1' // Get from auth context
      });

      if (response.success && response.number) {
        if (response.banned) {
          setError(`Number ${response.number} is banned. Please request a new number.`);
          // Auto-request replacement
          await replaceBannedNumber(response.id || '');
        } else {
          const newOrder: NumberOrder = {
            id: response.id || Date.now().toString(),
            number: response.number,
            service: service.name,
            country: selectedCountry,
            status: 'pending',
            price: service.price,
            createdAt: new Date().toISOString(),
            provider: response.provider
          };

          setOrders([newOrder, ...orders]);
          setSuccess(`Number ${response.number} assigned successfully! Waiting for code...`);
          setSelectedService('');
          
          // Start polling for code
          pollForCode(newOrder.id);
        }
      } else {
        if (response.error?.includes('balance')) {
          setError('Insufficient balance in SMS provider. Please try again later.');
        } else if (response.error?.includes('banned')) {
          setError('The assigned number is banned. Requesting a replacement...');
        } else {
          setError(response.error || 'Failed to request number');
        }
      }
    } catch (error) {
      setError('Failed to request number. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Poll for code
  const pollForCode = async (orderId: string) => {
    const maxAttempts = 30; // 5 minutes max
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) return;

      try {
        const response = await smsService.requestCode({
          numberId: orderId,
          serviceId: selectedService,
          userId: '1'
        });

        if (response.success && response.code) {
          // Update order with code
          setOrders(prev => prev.map(order => 
            order.id === orderId 
              ? { ...order, status: 'code_received', code: response.code }
              : order
          ));

          // Update wallet balance if deducted
          if (response.deducted && response.amount) {
            setWalletBalance(prev => prev - response.amount);
          }

          setSuccess(`Code received: ${response.code}`);
        } else {
          attempts++;
          setTimeout(poll, 10000); // Poll every 10 seconds
        }
      } catch (error) {
        attempts++;
        setTimeout(poll, 10000);
      }
    };

    poll();
  };

  // Replace banned number
  const replaceBannedNumber = async (numberId: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await smsService.replaceBannedNumber(numberId, '1');
      
      if (response.success && response.number) {
        setSuccess(`Banned number replaced with ${response.number}`);
        // Update the order
        setOrders(prev => prev.map(order => 
          order.id === numberId 
            ? { ...order, number: response.number!, status: 'pending', code: undefined }
            : order
        ));
        // Start polling for new code
        pollForCode(numberId);
      } else {
        setError('Failed to replace banned number');
      }
    } catch (error) {
      setError('Failed to replace banned number');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: 'bg-yellow-100 text-yellow-800',
      code_received: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      banned: 'bg-red-100 text-red-800',
      failed: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusConfig[status as keyof typeof statusConfig]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SMS Numbers</h1>
            <p className="text-gray-600 mt-1">Request and manage virtual phone numbers</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Wallet Balance</p>
              <p className="text-xl font-bold text-green-600">₦{walletBalance.toLocaleString()}</p>
            </div>
            <button
              onClick={loadWalletBalance}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
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

        {/* Order Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Request New Number</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Country Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  loadServices();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Service</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ₦{service.price} ({service.count} available)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={requestNumber}
            disabled={isLoading || !selectedService || !selectedCountry}
            className="mt-6 w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Requesting Number...
              </>
            ) : (
              <>
                <Phone className="w-5 h-5 mr-2" />
                Request Number
              </>
            )}
          </button>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Orders</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No orders yet. Request your first number above.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{order.number}</span>
                          <button
                            onClick={() => copyToClipboard(order.number)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.code ? (
                          <div className="flex items-center">
                            <span className="text-sm font-mono text-green-600">{order.code}</span>
                            <button
                              onClick={() => copyToClipboard(order.code)}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Waiting...</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₦{order.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          {order.status === 'banned' && (
                            <button
                              onClick={() => replaceBannedNumber(order.id)}
                              disabled={isLoading}
                              className="text-orange-600 hover:text-orange-900"
                              title="Replace Banned Number"
                            >
                              <Replace className="w-4 h-4" />
                            </button>
                          )}
                          {order.status === 'code_received' && (
                            <button
                              onClick={() => {
                                setCurrentOrder(order);
                                setShowCodeModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Code Modal */}
        {showCodeModal && currentOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Number</p>
                  <p className="text-lg font-medium">{currentOrder.number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service</p>
                  <p className="text-lg font-medium">{currentOrder.service}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Code/OTP</p>
                  <p className="text-2xl font-mono font-bold text-green-600">{currentOrder.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-lg font-medium">₦{currentOrder.price}</p>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => copyToClipboard(currentOrder.code || '')}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Copy Code
                </button>
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SMSNumberOrderPage;
