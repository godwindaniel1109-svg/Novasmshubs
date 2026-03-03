import React, { useState, useEffect } from 'react';
import { Phone, Plus, Edit2, Trash2, RefreshCw, AlertCircle, CheckCircle, XCircle, Loader, Settings, Globe, CreditCard, Ban, ToggleLeft, ToggleRight } from 'lucide-react';
import adminApiService from '../../services/adminApi';

interface SMSProvider {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  isActive: boolean;
  priority: number;
  successRate: number;
  responseTime: number;
  lastChecked: string;
}

interface NumberPool {
  id: string;
  number: string;
  country: string;
  service: string;
  provider: string;
  status: 'available' | 'assigned' | 'banned' | 'expired';
  assignedAt?: string;
  expiresAt?: string;
  price: number;
}

interface Service {
  id: string;
  name: string;
  provider: string;
  country: string;
  price: number;
  isActive: boolean;
  stock: number;
}

const NumberManagementPage: React.FC = () => {
  const [providers, setProviders] = useState<SMSProvider[]>([]);
  const [numberPool, setNumberPool] = useState<NumberPool[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'providers' | 'numbers' | 'services'>('providers');
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState<SMSProvider | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Load data
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (activeTab === 'providers') {
        const response = await adminApiService.getSMSProviders();
        if (response.error) {
          setError(response.error);
        } else {
          setProviders(response.providers || []);
        }
      } else if (activeTab === 'numbers') {
        const response = await adminApiService.getNumberPool();
        if (response.error) {
          setError(response.error);
        } else {
          setNumberPool(response.numbers || []);
        }
      } else if (activeTab === 'services') {
        const response = await adminApiService.getSMSServices();
        if (response.error) {
          setError(response.error);
        } else {
          setServices(response.services || []);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle provider status
  const toggleProvider = async (providerId: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await adminApiService.toggleSMSProvider(providerId);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Provider status updated successfully');
        loadData();
      }
    } catch (error) {
      setError('Failed to update provider status');
    } finally {
      setIsLoading(false);
    }
  };

  // Save provider
  const saveProvider = async (providerData: Partial<SMSProvider>) => {
    setIsLoading(true);
    setError('');

    try {
      let response;
      if (editingProvider) {
        response = await adminApiService.updateSMSProvider(editingProvider.id, providerData);
      } else {
        response = await adminApiService.createSMSProvider(providerData);
      }

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess(`Provider ${editingProvider ? 'updated' : 'created'} successfully`);
        setShowProviderModal(false);
        setEditingProvider(null);
        loadData();
      }
    } catch (error) {
      setError('Failed to save provider');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete provider
  const deleteProvider = async (providerId: string) => {
    if (!confirm('Are you sure you want to delete this provider?')) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await adminApiService.deleteSMSProvider(providerId);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Provider deleted successfully');
        loadData();
      }
    } catch (error) {
      setError('Failed to delete provider');
    } finally {
      setIsLoading(false);
    }
  };

  // Add numbers to pool
  const addNumbersToPool = async (numbers: string[], provider: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await adminApiService.addNumbersToPool({ numbers, provider });
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Numbers added to pool successfully');
        loadData();
      }
    } catch (error) {
      setError('Failed to add numbers to pool');
    } finally {
      setIsLoading(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      available: 'bg-green-100 text-green-800',
      assigned: 'bg-blue-100 text-blue-800',
      banned: 'bg-red-100 text-red-800',
      expired: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusConfig[status as keyof typeof statusConfig]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Number Management</h1>
            <p className="text-gray-600 mt-1">Manage SMS providers, number pool, and services</p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
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

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('providers')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'providers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Providers
              </button>
              <button
                onClick={() => setActiveTab('numbers')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'numbers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Number Pool
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'services'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <CreditCard className="w-4 h-4 inline mr-2" />
                Services
              </button>
            </nav>
          </div>

          {/* Providers Tab */}
          {activeTab === 'providers' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">SMS Providers</h3>
                <button
                  onClick={() => {
                    setEditingProvider(null);
                    setShowProviderModal(true);
                  }}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Provider
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {providers.map((provider) => (
                        <tr key={provider.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                              <div className="text-sm text-gray-500">{provider.baseUrl}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(provider.isActive ? 'active' : 'inactive')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {provider.priority}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm text-gray-900">{provider.successRate}%</div>
                              <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${provider.successRate}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {provider.responseTime}ms
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleProvider(provider.id)}
                                className="text-gray-600 hover:text-gray-900"
                                title={provider.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {provider.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingProvider(provider);
                                  setShowProviderModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteProvider(provider.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Number Pool Tab */}
          {activeTab === 'numbers' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Number Pool</h3>
                <button
                  onClick={() => {
                    // Add numbers modal
                    const numbers = prompt('Enter numbers (comma separated):');
                    if (numbers) {
                      addNumbersToPool(numbers.split(',').map(n => n.trim()), 'manual');
                    }
                  }}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Numbers
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {numberPool.map((number) => (
                        <tr key={number.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {number.number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {number.country}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {number.service}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {number.provider}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(number.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₦{number.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">SMS Services</h3>
                <button
                  onClick={() => {
                    setEditingService(null);
                    setShowServiceModal(true);
                  }}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {services.map((service) => (
                        <tr key={service.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {service.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {service.provider}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {service.country}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₦{service.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {service.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(service.isActive ? 'active' : 'inactive')}
                          </td>
                        </tr>
                      ))}
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

export default NumberManagementPage;
