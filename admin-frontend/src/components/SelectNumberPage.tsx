import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Phone, CheckCircle, AlertCircle, Loader, RefreshCw } from 'lucide-react';

interface PhoneNumber {
  id: string;
  number: string;
  country: string;
  operator: string;
  price: string;
  available: boolean;
}

const SelectNumberPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const country = searchParams.get('country') || '';
  const price = searchParams.get('price') || '₦500';
  
  const [numbers, setNumbers] = useState<PhoneNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    fetchNumbers();
  }, [country]);

  // Mock API function for fetching numbers
  // This will be replaced with actual 5Sim API integration later
  const fetchNumbers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call to 5Sim API
      // In the future, this will be a real API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock response - replace with actual 5Sim API response
      const mockNumbers: PhoneNumber[] = Array.from({ length: 10 }, (_, i) => ({
        id: `num_${i + 1}`,
        number: `+${getCountryCode(country)}${Math.floor(Math.random() * 900000000) + 100000000}`,
        country,
        operator: ['WhatsApp', 'Telegram', 'Instagram', 'Facebook', 'Twitter'][Math.floor(Math.random() * 5)],
        price,
        available: Math.random() > 0.2 // 80% availability
      }));

      setNumbers(mockNumbers);
    } catch (err) {
      setError('Failed to fetch numbers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCountryCode = (countryCode: string): string => {
    const countryCodes: { [key: string]: string } = {
      'US': '1',
      'UK': '44',
      'NG': '234',
      'CA': '1',
      'AU': '61',
      'DE': '49',
      'FR': '33',
      'IN': '91'
    };
    return countryCodes[countryCode] || '1';
  };

  const getCountryName = (countryCode: string): string => {
    const countryNames: { [key: string]: string } = {
      'US': 'United States',
      'UK': 'United Kingdom',
      'NG': 'Nigeria',
      'CA': 'Canada',
      'AU': 'Australia',
      'DE': 'Germany',
      'FR': 'France',
      'IN': 'India'
    };
    return countryNames[countryCode] || countryCode;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchNumbers();
    setIsRefreshing(false);
  };

  const handlePurchase = async () => {
    if (!selectedNumber) {
      setError('Please select a number');
      return;
    }

    setIsPurchasing(true);
    setError(null);

    try {
      // Simulate purchase API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate to success page or order confirmation
      navigate('/order-confirmation?number=' + selectedNumber);
    } catch (err) {
      setError('Failed to complete purchase. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-nova-primary" />
            <span className="ml-3 text-gray-600">Loading available numbers...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/buy-number')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-bold text-xl md:text-2xl text-gray-900">
                Select Number
              </h2>
              <p className="text-sm text-gray-600">
                {getCountryName(country)} (+{getCountryCode(country)}) - Starting from {price}
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {/* Numbers Grid */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {numbers.filter(n => n.available).length} numbers available
          </p>
        </div>

        <div className="grid gap-3">
          {numbers.map((phoneNumber) => (
            <div
              key={phoneNumber.id}
              className={`border rounded-lg p-4 transition-all cursor-pointer ${
                selectedNumber === phoneNumber.id
                  ? 'border-nova-primary bg-nova-primary/10'
                  : phoneNumber.available
                  ? 'border-gray-200 hover:border-nova-primary hover:bg-gray-50'
                  : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => phoneNumber.available && setSelectedNumber(phoneNumber.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-nova-primary/20 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-nova-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{phoneNumber.number}</div>
                    <div className="text-sm text-gray-500">{phoneNumber.operator}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{phoneNumber.price}</div>
                    <div className="text-sm text-gray-500">
                      {phoneNumber.available ? 'Available' : 'Unavailable'}
                    </div>
                  </div>
                  
                  {phoneNumber.available && (
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      selectedNumber === phoneNumber.id
                        ? 'bg-nova-primary border-nova-primary'
                        : 'border-gray-300'
                    }`}>
                      {selectedNumber === phoneNumber.id && (
                        <CheckCircle className="w-full h-full text-white" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {numbers.length === 0 && (
          <div className="text-center py-12">
            <Phone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No numbers available at the moment</p>
            <button
              onClick={handleRefresh}
              className="mt-4 text-nova-primary hover:text-nova-secondary font-medium"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      {/* Purchase Button */}
      {selectedNumber && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Selected Number</p>
              <p className="font-semibold text-gray-900">
                {numbers.find(n => n.id === selectedNumber)?.number}
              </p>
            </div>
            <button
              onClick={handlePurchase}
              disabled={isPurchasing}
              className="bg-gradient-to-r from-nova-primary to-nova-secondary text-black font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isPurchasing ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Purchasing...</span>
                </>
              ) : (
                <>
                  <span>Purchase Number</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-gradient-to-r from-nova-primary/10 to-nova-secondary/10 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-6 h-6 text-nova-primary mt-1" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Purchase Information</h4>
            <p className="text-sm text-gray-600 mb-3">
              Once purchased, the number will be immediately available for use. You'll receive all necessary details including the number, activation instructions, and service compatibility information.
            </p>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Instant activation</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>30-day validity</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Full support for all services</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectNumberPage;
