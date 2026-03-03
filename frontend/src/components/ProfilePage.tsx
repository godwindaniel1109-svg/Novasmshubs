import React, { useState, useRef, useEffect } from 'react';
import { User, Camera, Mail, Phone, Edit2, Save, X, Upload, Settings, Bell, Shield, Moon, Globe } from 'lucide-react';
import apiService from '../services/api';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  profileImage: string;
  createdAt: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    phone: '+1234567890',
    profileImage: '/images/default-avatar.png',
    createdAt: '2024-01-15'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');

  // Fetch user profile from API
  const fetchProfile = async () => {
    try {
      const response = await apiService.getProfile();
      if (response.error) {
        setError(response.error);
      } else {
        setProfile(response.profile || profile);
        setEditedProfile(response.profile || profile);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setError('Failed to load profile. Please try again.');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update profile via API
  const updateProfile = async (updatedData: UserProfile) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await apiService.updateProfile(updatedData);
      
      if (response.error) {
        setError(response.error);
      } else {
        setProfile(updatedData);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    twoFactorAuth: false,
    darkMode: false,
    language: 'en'
  });

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
    setSuccess('');
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile({
          ...editedProfile,
          profileImage: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    // Basic validation
    if (!editedProfile.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!editedProfile.username.trim()) {
      setError('Username is required');
      return;
    }

    if (!editedProfile.email.trim()) {
      setError('Email is required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedProfile.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Call API to update profile
    await updateProfile(editedProfile);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile({
      ...editedProfile,
      [field]: value
    });
  };

  const handleSettingChange = (setting: keyof typeof settings, value: boolean | string) => {
    setSettings({
      ...settings,
      [setting]: value
    });
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Settings updated successfully!');
    } catch (err) {
      setError('Failed to update settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:ml-64 h-screen">
      <div className="p-4 mt-14">
        {/* Page Header */}
        <div className="text-justify h-auto mb-4 rounded bg-white px-4 md:pt-4 md:pb-4 pb-10 pt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl md:font-extrabold md:text-2xl text-gray-900">Profile Settings</h2>
            {!isEditing && activeTab === 'profile' && (
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 bg-nova-primary text-white px-4 py-2 rounded-md hover:bg-nova-secondary transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="text-justify h-auto mb-4 rounded bg-white px-4 pt-4 pb-16">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-nova-primary text-nova-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-nova-primary text-nova-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Settings
              </button>
            </nav>
          </div>

          {activeTab === 'profile' ? (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Profile Image Section */}
              <div className="md:col-span-1">
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={isEditing ? editedProfile.profileImage : profile.profileImage}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                    {isEditing && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-nova-primary text-white p-2 rounded-full hover:bg-nova-secondary transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {isEditing ? editedProfile.name : profile.name}
                  </h3>
                  <p className="text-sm text-gray-500">@{isEditing ? editedProfile.username : profile.username}</p>
                  {isEditing && (
                    <div className="mt-4 text-xs text-gray-500">
                      <p>• JPG, PNG or GIF (max 5MB)</p>
                      <p>• Recommended: 400x400px</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Form Section */}
              <div className="md:col-span-2">
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={editedProfile.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-nova-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                          type="text"
                          value={editedProfile.username}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-nova-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-nova-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={editedProfile.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-nova-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-4 py-2 bg-nova-primary text-white rounded-md hover:bg-nova-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-900">{profile.name}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <p className="text-gray-900">@{profile.username}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-900">{profile.email}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-900">{profile.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                      <p className="text-gray-900">{new Date(profile.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Settings Tab */
            <div className="max-w-2xl">
              <div className="space-y-6">
                {/* Notifications */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                          <p className="text-sm text-gray-500">Receive email updates about your account</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.emailNotifications ? 'bg-nova-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                          <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSettingChange('pushNotifications', !settings.pushNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.pushNotifications ? 'bg-nova-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSettingChange('twoFactorAuth', !settings.twoFactorAuth)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.twoFactorAuth ? 'bg-nova-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Moon className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Dark Mode</p>
                          <p className="text-sm text-gray-500">Use dark theme across the application</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSettingChange('darkMode', !settings.darkMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.darkMode ? 'bg-nova-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Language</p>
                          <p className="text-sm text-gray-500">Select your preferred language</p>
                        </div>
                      </div>
                      <select
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-nova-primary focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Save Settings Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                    className="px-6 py-2 bg-nova-primary text-white rounded-md hover:bg-nova-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
