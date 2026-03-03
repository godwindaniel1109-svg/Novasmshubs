import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, AlertCircle, CheckCircle, X } from 'lucide-react';
import apiService from '../services/api';
import PaymentProofUpload from './PaymentProofUpload';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const FundWalletPage: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [paystackScriptLoaded, setPaystackScriptLoaded] = useState(false);
  const [showProofUpload, setShowProofUpload] = useState(false);

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setPaystackScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'manual',
      name: 'Manual Payment',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Pay manually through bank transfer and upload proof'
    },
    {
      id: 'paystack',
      name: 'Pay with Paystack',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Instant automatic payment with Paystack (Card/USSD/Bank Transfer)'
    },
    {
      id: 'card',
      name: 'Pay with Card + Proof',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Pay with card and upload payment proof for verification'
    }
  ];

  // Real API function for funding wallet
  const fundWallet = async (amount: number, gateway: string) => {
    try {
      const response = await apiService.fundWallet(amount, gateway);
      
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess(`Funding request submitted successfully! Reference: ${response.reference}`);
        // Refresh wallet balance
        const walletResponse = await apiService.getWalletBalance();
        if (walletResponse.balance !== undefined) {
          // Update wallet balance in UI
          console.log('New balance:', walletResponse.balance);
        }
      }
    } catch (error) {
      console.error('Funding failed:', error);
      setError('Funding failed. Please try again.');
    }
  };

  // Submit payment proof with API
  const submitPaymentProof = async (proofData: any) => {
    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('amount', proofData.amount.toString());
      formData.append('gateway', proofData.gateway);
      formData.append('comment', proofData.comment);
      formData.append('proofFile', proofData.proofFile);

      const response = await apiService.submitPaymentProof(formData);
      
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess(`Payment proof submitted successfully! Your payment will be reviewed and approved.`);
        setShowProofUpload(false);
        setAmount('');
        setSelectedMethod('');
      }
    } catch (error) {
      console.error('Failed to submit payment proof:', error);
      setError('Failed to submit payment proof. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    try {
      // Verify payment with your backend
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference }),
      });
      
      const data = await response.json();
      if (data.success) {
        // Update wallet balance in your app state
        console.log('Payment verified successfully');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);

    try {
      if (selectedMethod === 'paystack') {
        if (!paystackScriptLoaded) {
          throw new Error('Payment system is not ready. Please try again.');
        }

        // Initialize Paystack payment
        const paystack = new (window as any).PaystackPop();
        
        paystack.newTransaction({
          key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || 'pk_live_1360357981b26244290e833fb700ea775063618b',
          email: 'customer@example.com', // You'll get this from user context
          amount: parseFloat(amount) * 100, // Paystack expects amount in kobo
          currency: 'NGN',
          ref: `NOVA_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
          callback: (response: any) => {
            // Payment successful - call API to record transaction
            fundWallet(parseFloat(amount), 'paystack');
            setIsLoading(false);
          },
          onClose: () => {
            setError('Payment was cancelled. Please try again.');
            setIsLoading(false);
          }
        });
      } else if (selectedMethod === 'card') {
        // Show payment proof upload for card payments
        setShowProofUpload(true);
        setIsLoading(false);
      } else {
        // Handle manual payment - show proof upload
        setShowProofUpload(true);
        setIsLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:ml-64 h-screen">
      <div className="p-4 mt-14">
        {/* Page Header */}
        <div className="text-justify h-auto mb-4 rounded bg-white px-4 md:pt-4 md:pb-4 pb-10 pt-10">
          <h2 className="font-bold text-xl md:font-extrabold md:text-2xl text-gray-900">Fund Wallet</h2>
        </div>

        {/* Fund Wallet Form */}
        <div className="text-justify h-auto mb-4 rounded bg-white px-4 pt-4 pb-16">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method Selection */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Select Payment Method
              </label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-nova-primary focus:border-transparent"
              >
                <option value="" disabled>Select Payment Method</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
              
              {/* Payment Method Cards */}
              <div className="mt-4 space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? 'border-nova-primary bg-nova-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        selectedMethod === method.id
                          ? 'bg-nova-primary text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{method.name}</h3>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                      {selectedMethod === method.id && (
                        <CheckCircle className="w-5 h-5 text-nova-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900">
                Amount (₦)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₦
                </span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="100"
                  step="100"
                  className="block w-full pl-8 pr-4 py-3 text-gray-900 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-2 focus:ring-nova-primary focus:border-transparent"
                  required
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Minimum amount: ₦100
              </p>
            </div>

            {/* Quick Amount Buttons */}
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Quick Amount</p>
              <div className="grid grid-cols-3 gap-2">
                {[1000, 2000, 5000, 10000, 20000, 50000].map((quickAmount) => (
                  <button
                    type="button"
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount.toString())}
                    className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 hover:border-nova-primary transition-colors"
                  >
                    ₦{quickAmount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-700">{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-nova-navy text-white font-medium rounded-md text-sm px-4 py-3 text-center hover:bg-nova-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Add Funds ${amount ? `(₦${parseFloat(amount).toLocaleString()})` : ''}`
                )}
              </button>
            </div>
          </form>

          {/* Payment Proof Upload Modal */}
          {showProofUpload && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Upload Payment Proof</h3>
                    <button
                      onClick={() => setShowProofUpload(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <PaymentProofUpload
                    amount={parseFloat(amount)}
                    gateway={selectedMethod}
                    onSubmit={submitPaymentProof}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-medium text-blue-900 mb-2">Payment Information</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Paystack supports card, USSD, and bank transfer payments</li>
              <li>• Card payments are instant</li>
              <li>• USSD and bank transfers may take a few minutes to process</li>
              <li>• Manual payments require proof upload for verification</li>
              <li>• Card + Proof payments require verification</li>
              <li>• Minimum funding amount is ₦100</li>
              <li>• For support: Call 07048694977 or Telegram @Primesmshub</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundWalletPage;
