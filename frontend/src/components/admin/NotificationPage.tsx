import React, { useState } from 'react';
import { Bell, Send, Users, Mail, MessageSquare, Search, Filter } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'individual' | 'bulk';
  recipient?: string;
  status: 'sent' | 'draft' | 'scheduled';
  date: string;
  readCount?: number;
}

const NotificationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'send' | 'history'>('send');
  const [notificationType, setNotificationType] = useState<'individual' | 'bulk'>('bulk');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const notifications: Notification[] = [
    {
      id: 1,
      title: 'System Maintenance',
      message: 'We will be performing scheduled maintenance on our servers...',
      type: 'bulk',
      status: 'sent',
      date: '2026-01-04 10:00',
      readCount: 1234
    },
    {
      id: 2,
      title: 'Payment Issue',
      message: 'Your recent payment could not be processed. Please update your payment method.',
      type: 'individual',
      recipient: 'john@example.com',
      status: 'sent',
      date: '2026-01-04 09:30'
    },
    {
      id: 3,
      title: 'New Features Available',
      message: 'Check out our latest features including improved security...',
      type: 'bulk',
      status: 'draft',
      date: '2026-01-04 08:00'
    },
    {
      id: 4,
      title: 'Account Verification',
      message: 'Please verify your account to continue using our services.',
      type: 'individual',
      recipient: 'jane@example.com',
      status: 'scheduled',
      date: '2026-01-05 12:00'
    }
  ];

  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
    { id: '4', name: 'Sarah Williams', email: 'sarah@example.com' }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      sent: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusConfig[status as keyof typeof statusConfig]}`}>
        {status}
      </span>
    );
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendNotification = () => {
    const notification = {
      type: notificationType,
      title,
      message,
      recipients: notificationType === 'individual' ? selectedUsers : 'all'
    };
    
    console.log('Sending notification:', notification);
    // Implement notification sending logic
    
    // Reset form
    setTitle('');
    setMessage('');
    setSelectedUsers([]);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600">Send notifications to users and manage notification history</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('send')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'send'
                ? 'border-nova-primary text-nova-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Send className="w-4 h-4 inline mr-2" />
            Send Notification
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-nova-primary text-nova-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Bell className="w-4 h-4 inline mr-2" />
            Notification History
          </button>
        </nav>
      </div>

      {activeTab === 'send' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notification Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Compose Notification</h2>
              
              {/* Notification Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Notification Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="bulk"
                      checked={notificationType === 'bulk'}
                      onChange={(e) => setNotificationType(e.target.value as 'bulk' | 'individual')}
                      className="mr-2 text-nova-primary focus:ring-nova-primary"
                    />
                    <Users className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="text-sm text-gray-700">Send to All Users</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="individual"
                      checked={notificationType === 'individual'}
                      onChange={(e) => setNotificationType(e.target.value as 'bulk' | 'individual')}
                      className="mr-2 text-nova-primary focus:ring-nova-primary"
                    />
                    <Mail className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="text-sm text-gray-700">Send to Individual Users</span>
                  </label>
                </div>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nova-primary focus:border-transparent"
                  placeholder="Enter notification title..."
                />
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nova-primary focus:border-transparent"
                  placeholder="Enter your notification message..."
                />
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendNotification}
                disabled={!title || !message || (notificationType === 'individual' && selectedUsers.length === 0)}
                className="w-full px-4 py-2 bg-nova-primary text-white rounded-lg hover:bg-nova-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4 inline mr-2" />
                Send Notification
              </button>
            </div>
          </div>

          {/* User Selection (for individual notifications) */}
          {notificationType === 'individual' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Users</h3>
              
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nova-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* User List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <label key={user.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="mr-3 text-nova-primary focus:ring-nova-primary"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </label>
                ))}
              </div>

              {selectedUsers.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Notification History */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Read Count</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <tr key={notification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{notification.message}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        notification.type === 'bulk' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {notification.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {notification.recipient || 'All Users'}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(notification.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{notification.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {notification.readCount || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
