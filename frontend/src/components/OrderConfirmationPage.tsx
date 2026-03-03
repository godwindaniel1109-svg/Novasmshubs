import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Phone, Calendar, Shield } from 'lucide-react';

const OrderConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const number = searchParams.get('number') || '';

  return (
    <div className="space-y-4">
      {/* Success Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="font-bold text-2xl md:text-3xl text-gray-900 mb-2">
            Purchase Successful!
          </h2>
          <p className="text-gray-600">
            Your virtual number has been successfully purchased and is ready to use.
          </p>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">Order Details</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-nova-primary/20 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-nova-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Virtual Number</p>
                <p className="font-semibold text-gray-900">{number}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Price</p>
              <p className="font-semibold text-gray-900">₦500</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-nova-primary" />
              <div>
                <p className="text-sm text-gray-600">Purchase Date</p>
                <p className="font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-nova-primary" />
              <div>
                <p className="text-sm text-gray-600">Valid Until</p>
                <p className="font-medium text-gray-900">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activation Instructions */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">Activation Instructions</h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-nova-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900">Copy the number</p>
              <p className="text-sm text-gray-600">Use the copy button to easily copy your new virtual number</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-nova-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900">Use in your preferred service</p>
              <p className="text-sm text-gray-600">Enter the number in WhatsApp, Telegram, Instagram, or any other service</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-nova-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div>
              <p className="font-medium text-gray-900">Receive verification code</p>
              <p className="text-sm text-gray-600">Check your NovaSMSHub dashboard for incoming SMS messages</p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your number is now active and ready to receive SMS messages. Check your dashboard for incoming messages.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => navigate('/buy-number')}
          className="bg-gradient-to-r from-nova-primary to-nova-secondary text-black font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all flex items-center justify-center space-x-2"
        >
          <span>Buy Another Number</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Support Info */}
      <div className="bg-gradient-to-r from-nova-primary/10 to-nova-secondary/10 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-nova-primary mt-1" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600 mb-3">
              If you encounter any issues with your number or have questions, our support team is here to help you 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://t.me/Primesmshub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-nova-primary hover:text-nova-secondary font-medium text-sm flex items-center space-x-1"
              >
                <span>Telegram Support</span>
                <ArrowRight className="w-3 h-3" />
              </a>
              <a
                href="/order-history"
                className="text-nova-primary hover:text-nova-secondary font-medium text-sm flex items-center space-x-1"
              >
                <span>View Order History</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
