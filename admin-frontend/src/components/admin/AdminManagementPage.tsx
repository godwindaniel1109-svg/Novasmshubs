import React, { useState, useEffect } from 'react';
import { Users, Shield, Eye, Edit2, Trash2, Plus, RefreshCw, AlertCircle, CheckCircle, XCircle, Loader, Settings, Crown, Star, Key, Globe } from 'lucide-react';
import adminApiService from '../../services/adminApi';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'validator' | 'moderator' | undefined;
  permissions: {
    dashboard: boolean;
    users: boolean;
    transactions: boolean;
    payments: boolean;
    numbers: boolean;
    providers: boolean;
    reports: boolean;
    settings: boolean;
  };
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  createdBy: string;
}

// Create a type for the role
type AdminRole = 'super_admin' | 'admin' | 'validator' | 'moderator' | '';

interface RoleTemplate {
  role: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  permissions: typeof AdminUser['permissions'];
  color: string;
}

const AdminManagementPage: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<AdminRole>('');
  const [customPermissions, setCustomPermissions] = useState<AdminUser['permissions']>({
    dashboard: true,
    users: false,
    transactions: false,
    payments: false,
    numbers: false,
    providers: false,
    reports: false,
    settings: false
  });

  const roleTemplates: RoleTemplate[] = [
    {
      role: 'super_admin',
      name: 'Super Admin',
      icon: <Crown className="w-5 h-5" />,
      description: 'Complete control over all aspects of the system',
      permissions: {
        dashboard: true,
        users: true,
        transactions: true,
        payments: true,
        numbers: true,
        providers: true,
        reports: true,
        settings: true
      },
      color: 'bg-purple-100 text-purple-800'
    },
    {
      role: 'admin',
      name: 'Admin',
      icon: <Shield className="w-5 h-5" />,
      description: 'Full access to user management and transactions',
      permissions: {
        dashboard: true,
        users: true,
        transactions: true,
        payments: true,
        numbers: true,
        providers: false,
        reports: true,
        settings: false
      },
      color: 'bg-blue-100 text-blue-800'
    },
    {
      role: 'validator',
      name: 'Validator',
      icon: <CheckCircle className="w-5 h-5" />,
      description: 'Can validate payments and manage transactions',
      permissions: {
        dashboard: true,
        users: false,
        transactions: true,
        payments: true,
        numbers: false,
        providers: false,
        reports: true,
        settings: false
      },
      color: 'bg-green-100 text-green-800'
    },
    {
      role: 'moderator',
      name: 'Moderator',
      icon: <Star className="w-5 h-5" />,
      description: 'Can moderate users and view reports',
      permissions: {
        dashboard: true,
        users: true,
        transactions: false,
        payments: false,
        numbers: false,
        providers: false,
        reports: true,
        settings: false
      },
      color: 'bg-yellow-100 text-yellow-800'
    }
  ];

  // Load admins
  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await adminApiService.getAdminUsers();
      if (response.error) {
        setError(response.error);
      } else {
        setAdmins(response.admins || []);
      }
    } catch (error) {
      console.error('Error loading admins:', error);
      setError('Failed to load admin users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save admin
  const saveAdmin = async (adminData: Partial<AdminUser>) => {
    setIsLoading(true);
    setError('');

    try {
      let response;
      if (editingAdmin) {
        response = await adminApiService.updateAdminUser(editingAdmin.id, adminData);
      } else {
        response = await adminApiService.createAdminUser(adminData);
      }

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess(`Admin ${editingAdmin ? 'updated' : 'created'} successfully`);
        setShowModal(false);
        setEditingAdmin(null);
        loadAdmins();
      }
    } catch (error) {
      setError('Failed to save admin user');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete admin
  const deleteAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to delete this admin user?')) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await adminApiService.deleteAdminUser(adminId);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Admin user deleted successfully');
        loadAdmins();
      }
    } catch (error) {
      setError('Failed to delete admin user');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle admin status
  const toggleAdminStatus = async (adminId: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await adminApiService.toggleAdminUser(adminId);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Admin status updated successfully');
        loadAdmins();
      }
    } catch (error) {
      setError('Failed to update admin status');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle role selection
  const handleRoleSelect = (role: AdminRole) => {
    setSelectedRole(role);
    const template = roleTemplates.find(t => t.role === role);
    if (template) {
      setCustomPermissions(template.permissions);
    }
  };

  // Get role badge
  const getRoleBadge = (role: string) => {
    const template = roleTemplates.find(t => t.role === role);
    return template ? (
      <span className={`px-2 py-1 text-xs rounded-full ${template.color}`}>
        {template.name}
      </span>
    ) : null;
  };

  // Get permission icon
  const getPermissionIcon = (hasPermission: boolean) => {
    return hasPermission ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-gray-400" />
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
            <p className="text-gray-600 mt-1">Manage admin users, roles, and permissions</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={loadAdmins}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={() => {
                setEditingAdmin(null);
                setSelectedRole('');
                setCustomPermissions({
                  dashboard: true,
                  users: false,
                  transactions: false,
                  payments: false,
                  numbers: false,
                  providers: false,
                  reports: false,
                  settings: false
                });
                setShowModal(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Admin
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

        {/* Role Templates */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roleTemplates.map((template) => (
              <div key={template.role} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className={`p-2 rounded-lg ${template.color} mr-3`}>
                    {template.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
                <div className="space-y-1 mt-3">
                  {Object.entries(template.permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 capitalize">{key}</span>
                      {getPermissionIcon(value as boolean)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Admin Users</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <Loader className="w-8 h-8 animate-spin text-blue-500" />
                        <span className="ml-2 text-gray-600">Loading admin users...</span>
                      </div>
                    </td>
                  </tr>
                ) : admins.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No admin users found. Add your first admin user above.
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{admin.username}</div>
                          <div className="text-sm text-gray-500">{admin.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(admin.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(admin.permissions).map(([key, value]) => (
                            value && (
                              <span key={key} className="px-1 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                                {key.charAt(0).toUpperCase()}
                              </span>
                            )
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(admin.lastLogin).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleAdminStatus(admin.id)}
                            className={`p-1 rounded ${
                              admin.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'
                            }`}
                            title={admin.isActive ? 'Deactivate' : 'Activate'}
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingAdmin(admin);
                              setSelectedRole(admin.role);
                              setCustomPermissions(admin.permissions);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteAdmin(admin.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Add/Edit Admin Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingAdmin ? 'Edit Admin User' : 'Add New Admin User'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* User Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        defaultValue={editingAdmin?.username}
                        placeholder="Enter username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={editingAdmin?.email}
                        placeholder="Enter email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {!editingAdmin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {roleTemplates.map((template) => (
                        <button
                          key={template.role}
                          onClick={() => handleRoleSelect(template.role as any)}
                          className={`p-3 border rounded-lg text-left transition-colors ${
                            selectedRole === template.role
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${template.color} mr-3`}>
                              {template.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{template.name}</h4>
                              <p className="text-sm text-gray-600">{template.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Permissions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permissions
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(customPermissions).map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setCustomPermissions(prev => ({
                              ...prev,
                              [key]: e.target.checked
                            }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 capitalize">{key}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveAdmin({
                      username: 'temp', // Get from form
                      email: 'temp@example.com', // Get from form
                      role: selectedRole || undefined,
                      permissions: customPermissions,
                      isActive: true
                    })}
                    disabled={isLoading || !selectedRole}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      editingAdmin ? 'Update Admin' : 'Create Admin'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagementPage;
