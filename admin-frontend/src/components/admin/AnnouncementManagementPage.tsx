import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  Users, 
  User, 
  Megaphone, 
  Calendar, 
  Clock, 
  Eye, 
  EyeOff,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  Loader
} from 'lucide-react';
import adminApiService from '../../services/adminApi';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  target: 'all' | 'individual';
  targetUsers?: string[];
  deliveryMethod: 'app' | 'notification' | 'both';
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
  scheduledFor?: string;
  createdAt: string;
  createdBy: string;
  sentAt?: string;
  readCount: number;
  totalRecipients: number;
}

const AnnouncementManagementPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error',
    target: 'all' as 'all' | 'individual',
    deliveryMethod: 'both' as 'app' | 'notification' | 'both',
    priority: 'medium' as 'low' | 'medium' | 'high',
    scheduledFor: '',
    isActive: true
  });

  useEffect(() => {
    loadAnnouncements();
    loadUsers();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setIsLoading(true);
      const response = await adminApiService.getAnnouncements();
      if (response.error) {
        setError(response.error);
      } else {
        setAnnouncements(response.announcements || []);
      }
    } catch (error) {
      setError('Failed to load announcements');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await adminApiService.getUsers();
      if (response.error) {
        setError(response.error);
      } else {
        setUsers(response.users || []);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      setError('Title and message are required');
      return;
    }

    if (formData.target === 'individual' && selectedUsers.length === 0) {
      setError('Please select at least one user for individual announcements');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const announcementData = {
        ...formData,
        targetUsers: formData.target === 'individual' ? selectedUsers : undefined
      };

      let response;
      if (editingAnnouncement) {
        response = await adminApiService.updateAnnouncement(editingAnnouncement.id, announcementData);
      } else {
        response = await adminApiService.createAnnouncement(announcementData);
      }

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess(editingAnnouncement ? 'Announcement updated successfully!' : 'Announcement created successfully!');
        setShowModal(false);
        resetForm();
        loadAnnouncements();
      }
    } catch (error) {
      setError('Failed to save announcement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      target: announcement.target,
      deliveryMethod: announcement.deliveryMethod,
      priority: announcement.priority,
      scheduledFor: announcement.scheduledFor || '',
      isActive: announcement.isActive
    });
    setSelectedUsers(announcement.targetUsers || []);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      setIsLoading(true);
      const response = await adminApiService.deleteAnnouncement(id);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Announcement deleted successfully!');
        loadAnnouncements();
      }
    } catch (error) {
      setError('Failed to delete announcement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await adminApiService.toggleAnnouncement(id);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Announcement status updated successfully!');
        loadAnnouncements();
      }
    } catch (error) {
      setError('Failed to update announcement status');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      target: 'all',
      deliveryMethod: 'both',
      priority: 'medium',
      scheduledFor: '',
      isActive: true
    });
    setSelectedUsers([]);
    setEditingAnnouncement(null);
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcement Management</h1>
          <p className="text-gray-600 mt-1">Create and manage system announcements</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Announcement
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Announcements</p>
              <p className="text-2xl font-bold text-gray-900">{announcements.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Megaphone className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {announcements.filter(a => a.isActive).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Recipients</p>
              <p className="text-2xl font-bold text-gray-900">
                {announcements.reduce((sum, a) => sum + a.totalRecipients, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Read Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {announcements.length > 0 
                  ? Math.round((announcements.reduce((sum, a) => sum + a.readCount, 0) / 
                     announcements.reduce((sum, a) => sum + a.totalRecipients, 0)) * 100)
                  : 0}%
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Eye className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {/* Announcements Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Announcements</h2>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Announcement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {announcements.map((announcement) => (
                  <tr key={announcement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center">
                          {getAnnouncementIcon(announcement.type)}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {announcement.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {announcement.message}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeBadge(announcement.type)}`}>
                        {announcement.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        {announcement.target === 'all' ? (
                          <>
                            <Users className="w-4 h-4 mr-1" />
                            All Users
                          </>
                        ) : (
                          <>
                            <User className="w-4 h-4 mr-1" />
                            {announcement.targetUsers?.length || 0} Users
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {announcement.deliveryMethod === 'both' ? 'App + Notification' : 
                         announcement.deliveryMethod === 'app' ? 'App Only' : 'Notification Only'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadge(announcement.priority)}`}>
                        {announcement.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {announcement.isActive ? (
                          <>
                            <Eye className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600">Active</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-500">Inactive</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div>{announcement.readCount}/{announcement.totalRecipients} reads</div>
                        <div className="text-xs text-gray-500">
                          {announcement.totalRecipients > 0 
                            ? Math.round((announcement.readCount / announcement.totalRecipients) * 100)
                            : 0}% read rate
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(announcement)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(announcement.id)}
                          className={announcement.isActive ? "text-yellow-600 hover:text-yellow-800" : "text-green-600 hover:text-green-800"}
                        >
                          {announcement.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(announcement.id)}
                          className="text-red-600 hover:text-red-800"
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter announcement title"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Enter announcement message"
                  required
                />
              </div>

              {/* Type and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Target Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="all"
                      checked={formData.target === 'all'}
                      onChange={(e) => setFormData({ ...formData, target: e.target.value as any })}
                      className="mr-2"
                    />
                    <Users className="w-4 h-4 mr-2" />
                    <span>Send to All Users</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="individual"
                      checked={formData.target === 'individual'}
                      onChange={(e) => setFormData({ ...formData, target: e.target.value as any })}
                      className="mr-2"
                    />
                    <User className="w-4 h-4 mr-2" />
                    <span>Send to Individual Users</span>
                  </label>
                </div>

                {formData.target === 'individual' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Users
                    </label>
                    <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                      {users.map((user) => (
                        <label key={user.id} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers([...selectedUsers, user.id]);
                              } else {
                                setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{user.username} ({user.email})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Method
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="app"
                      checked={formData.deliveryMethod === 'app'}
                      onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value as any })}
                      className="mr-2"
                    />
                    <div className="flex-1">
                      <div className="font-medium">App Display</div>
                      <div className="text-sm text-gray-500">Show immediately when user logs in</div>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="notification"
                      checked={formData.deliveryMethod === 'notification'}
                      onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value as any })}
                      className="mr-2"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Notification</div>
                      <div className="text-sm text-gray-500">Send to notification center (shown when user comes online)</div>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="both"
                      checked={formData.deliveryMethod === 'both'}
                      onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value as any })}
                      className="mr-2"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Both</div>
                      <div className="text-sm text-gray-500">Show in app and send notification</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to send immediately</p>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active immediately
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isLoading ? (
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {editingAnnouncement ? 'Update Announcement' : 'Send Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementManagementPage;
