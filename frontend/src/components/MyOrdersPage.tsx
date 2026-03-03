import React, { useState, useEffect } from 'react';
import { RefreshCw, Phone, Clock, DollarSign, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

interface Order {
  id: number;
  user_id: number;
  order_id: string;
  code: string;
  service_id: string | null;
  serviceName: string;
  phoneNumber: string;
  country: string;
  amount: number;
  status: number; // 0=pending, 1=complete, 2=cancelled
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  can_purchase: string;
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    wallet_balance: number;
    phone: string | null;
  };
}

const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [error, setError] = useState('');

  // Mock API function - replace with real API call later
  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    setError('');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock orders data matching your API response format
      const mockOrders: Order[] = [
        {
          id: 1,
          user_id: 5160,
          order_id: "1",
          code: "",
          service_id: null,
          serviceName: "Telegram",
          phoneNumber: "4794964477",
          country: "USA",
          amount: 2699,
          status: 2,
          expiresAt: null,
          createdAt: "2025-12-08T12:37:00.000000Z",
          updatedAt: "2025-12-08T12:37:00.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 2,
          user_id: 5160,
          order_id: "2",
          code: "",
          service_id: null,
          serviceName: "Telegram",
          phoneNumber: "6015131161",
          country: "USA",
          amount: 2699,
          status: 2,
          expiresAt: null,
          createdAt: "2025-12-08T12:37:00.000000Z",
          updatedAt: "2025-12-08T12:37:00.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 3,
          user_id: 5160,
          order_id: "3",
          code: "",
          service_id: null,
          serviceName: "Telegram",
          phoneNumber: "9142693242",
          country: "USA",
          amount: 2699,
          status: 2,
          expiresAt: null,
          createdAt: "2025-12-08T12:37:00.000000Z",
          updatedAt: "2025-12-08T12:37:00.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 4,
          user_id: 5160,
          order_id: "4",
          code: "",
          service_id: null,
          serviceName: "Telegram",
          phoneNumber: "7324078563",
          country: "USA",
          amount: 2699,
          status: 2,
          expiresAt: null,
          createdAt: "2025-12-08T12:37:00.000000Z",
          updatedAt: "2025-12-08T12:37:00.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 5,
          user_id: 5160,
          order_id: "5",
          code: "",
          service_id: null,
          serviceName: "Telegram",
          phoneNumber: "8021107542",
          country: "USA",
          amount: 2296,
          status: 2,
          expiresAt: null,
          createdAt: "2025-11-30T18:32:00.000000Z",
          updatedAt: "2025-11-30T18:32:00.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 6,
          user_id: 5160,
          order_id: "6",
          code: "",
          service_id: null,
          serviceName: "Telegram",
          phoneNumber: "8128975943",
          country: "USA",
          amount: 2296,
          status: 2,
          expiresAt: null,
          createdAt: "2025-11-30T18:25:00.000000Z",
          updatedAt: "2025-11-30T18:25:00.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 7,
          user_id: 5160,
          order_id: "7",
          code: "",
          service_id: null,
          serviceName: "Telegram",
          phoneNumber: "8021462348",
          country: "USA",
          amount: 2296,
          status: 2,
          expiresAt: null,
          createdAt: "2025-11-30T18:25:00.000000Z",
          updatedAt: "2025-11-30T18:25:00.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 8,
          user_id: 5160,
          order_id: "8",
          code: "",
          service_id: null,
          serviceName: "Telegram",
          phoneNumber: "3122966656",
          country: "USA",
          amount: 3071,
          status: 2,
          expiresAt: null,
          createdAt: "2025-11-19T13:26:00.000000Z",
          updatedAt: "2025-11-19T13:26:00.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 9,
          user_id: 5160,
          order_id: "9",
          code: "41702",
          service_id: null,
          serviceName: "Telegram",
          phoneNumber: "17014213731",
          country: "USA",
          amount: 2808,
          status: 1,
          expiresAt: "2025-09-24T16:16:03+01:00",
          createdAt: "2025-09-24T15:06:03.000000Z",
          updatedAt: "2025-09-24T15:08:02.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 10,
          user_id: 5160,
          order_id: "10",
          code: "",
          service_id: null,
          serviceName: "Telegram",
          phoneNumber: "15616057019",
          country: "USA",
          amount: 2885,
          status: 2,
          expiresAt: "2025-09-24T16:02:32+01:00",
          createdAt: "2025-09-24T14:52:32.000000Z",
          updatedAt: "2025-09-24T15:05:09.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 11,
          user_id: 5160,
          order_id: "11",
          code: "",
          service_id: null,
          serviceName: "Telegram",
          phoneNumber: "13054331035",
          country: "USA",
          amount: 2885,
          status: 2,
          expiresAt: "2025-09-24T15:48:57+01:00",
          createdAt: "2025-09-24T14:38:57.000000Z",
          updatedAt: "2025-09-24T14:52:22.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 12,
          user_id: 5160,
          order_id: "12",
          code: "",
          service_id: null,
          serviceName: "Telegram",
          phoneNumber: "14583274406",
          country: "USA",
          amount: 2885,
          status: 2,
          expiresAt: "2025-09-24T15:48:14+01:00",
          createdAt: "2025-09-24T14:38:14.000000Z",
          updatedAt: "2025-09-24T14:52:22.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 13,
          user_id: 5160,
          order_id: "13",
          code: "",
          service_id: null,
          serviceName: "Telegram",
          phoneNumber: "17755283377",
          country: "USA",
          amount: 2885,
          status: 2,
          expiresAt: "2025-09-24T15:39:52+01:00",
          createdAt: "2025-09-24T14:29:52.000000Z",
          updatedAt: "2025-09-24T14:39:56.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 14,
          user_id: 5160,
          order_id: "14",
          code: "",
          service_id: null,
          serviceName: "Telegram",
          phoneNumber: "18146098674",
          country: "USA",
          amount: 2885,
          status: 2,
          expiresAt: "2025-09-24T15:38:28+01:00",
          createdAt: "2025-09-24T14:28:28.000000Z",
          updatedAt: "2025-09-24T14:38:34.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 15,
          user_id: 5160,
          order_id: "15",
          code: "",
          service_id: null,
          serviceName: "WhatsApp",
          phoneNumber: "15510522980",
          country: "USA",
          amount: 9735,
          status: 0,
          expiresAt: null,
          createdAt: "2025-09-05T11:04:00.000000Z",
          updatedAt: "2025-09-05T11:04:00.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 16,
          user_id: 5160,
          order_id: "16",
          code: "214883",
          service_id: null,
          serviceName: "WhatsApp",
          phoneNumber: "19124199608",
          country: "USA",
          amount: 1830,
          status: 1,
          expiresAt: null,
          createdAt: "2025-07-21T20:47:21.000000Z",
          updatedAt: "2025-07-21T20:48:20.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 17,
          user_id: 5160,
          order_id: "17",
          code: "752650",
          service_id: null,
          serviceName: "WhatsApp",
          phoneNumber: "15392348271",
          country: "USA",
          amount: 1669,
          status: 1,
          expiresAt: null,
          createdAt: "2025-07-19T17:26:34.000000Z",
          updatedAt: "2025-07-19T17:27:51.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 18,
          user_id: 5160,
          order_id: "18",
          code: "",
          service_id: null,
          serviceName: "WhatsApp",
          phoneNumber: "14353461000",
          country: "USA",
          amount: 3970,
          status: 2,
          expiresAt: null,
          createdAt: "2025-05-07T16:35:47.000000Z",
          updatedAt: "2025-05-07T16:38:33.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 19,
          user_id: 5160,
          order_id: "19",
          code: "193803",
          service_id: null,
          serviceName: "WhatsApp",
          phoneNumber: "17793565871",
          country: "USA",
          amount: 3970,
          status: 1,
          expiresAt: null,
          createdAt: "2025-05-07T16:35:41.000000Z",
          updatedAt: "2025-05-07T16:36:27.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 20,
          user_id: 5160,
          order_id: "20",
          code: "17849",
          service_id: null,
          serviceName: "Telegram",
          phoneNumber: "12193687153",
          country: "USA",
          amount: 3145,
          status: 1,
          expiresAt: null,
          createdAt: "2025-05-07T15:33:49.000000Z",
          updatedAt: "2025-05-07T15:38:06.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 21,
          user_id: 5160,
          order_id: "21",
          code: "",
          service_id: null,
          serviceName: "Telegram",
          phoneNumber: "12395648507",
          country: "USA",
          amount: 2980,
          status: 2,
          expiresAt: null,
          createdAt: "2025-05-06T17:30:54.000000Z",
          updatedAt: "2025-05-06T17:41:01.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 22,
          user_id: 5160,
          order_id: "22",
          code: "",
          service_id: null,
          serviceName: "WhatsApp",
          phoneNumber: "4197903510",
          country: "USA",
          amount: 4003,
          status: 0,
          expiresAt: null,
          createdAt: "2025-05-06T13:14:00.000000Z",
          updatedAt: "2025-05-06T13:14:00.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        },
        {
          id: 23,
          user_id: 5160,
          order_id: "23",
          code: "",
          service_id: null,
          serviceName: "WhatsApp",
          phoneNumber: "6502089721",
          country: "USA",
          amount: 4003,
          status: 0,
          expiresAt: null,
          createdAt: "2025-05-06T13:14:00.000000Z",
          updatedAt: "2025-05-06T13:14:00.000000Z",
          can_purchase: "1",
          user: {
            id: 5160,
            name: "Handsome Dwin ",
            email: "handsomedwin8@gmail.com",
            email_verified_at: null,
            status: "active",
            created_at: "2025-05-05T10:04:48.000000Z",
            updated_at: "2025-09-24T15:08:02.000000Z",
            wallet_balance: 140,
            phone: null
          }
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const formatTimeRemaining = (expiresAt: string | null, status: number) => {
    if (status === 1) return '0:00';
    if (status === 2 || status > 2) return '---';
    
    if (!expiresAt) return '---';
    
    const now = new Date().getTime();
    const expires = new Date(expiresAt).getTime();
    const distance = expires - now;

    if (distance < 0) return 'Expired';

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return 'bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full';
      case 1:
        return 'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full';
      case 2:
        return 'bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full';
      default:
        return 'bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'pending';
      case 1: return 'complete';
      case 2: return 'cancelled';
      default: return 'unknown';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update timers every second
  useEffect(() => {
    const timerInterval = setInterval(() => {
      // Force re-render to update timers
      setOrders(prev => [...prev]);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="font-bold text-xl md:text-2xl text-gray-900">
          Order History
        </h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50">
          <AlertCircle className="flex-shrink-0 w-4 h-4" />
          <span className="ms-3 text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3 bg-gray-50">
                  PHONE NUMBER
                </th>
                <th className="px-6 py-3">
                  CODE
                </th>
                <th className="px-6 py-3">
                  SERVICE
                </th>
                <th className="px-6 py-3">
                  TIME LEFT
                </th>
                <th className="px-6 py-3 bg-gray-50">
                  ID
                </th>
                <th className="px-6 py-3">
                  DATE
                </th>
                <th className="px-6 py-3">
                  PRICE
                </th>
                <th className="px-6 py-3 bg-gray-50">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoadingOrders ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <Loader className="w-6 h-6 animate-spin text-nova-primary" />
                      <span className="ml-2">Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200">
                    <td className="px-6 py-4 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{order.phoneNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {order.code || ''}
                    </td>
                    <td className="px-6 py-4">{order.serviceName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-mono font-bold">
                          {formatTimeRemaining(order.expiresAt, order.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">
                      {order.order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span>₦{order.amount.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 bg-gray-50">
                      <span className={getStatusBadge(order.status)}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 0).length}
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
              <p className="text-sm text-gray-500">Completed Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 1).length}
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
              <p className="text-sm text-gray-500">Cancelled Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 2).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
