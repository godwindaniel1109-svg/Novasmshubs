import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboardLayout from './components/AdminDashboardLayout';
import AdminDashboardPage from './components/AdminDashboardPage';
import UserManagementPage from './components/UserManagementPage';
import TransactionManagementPage from './components/TransactionManagementPage';
import NotificationPage from './components/NotificationPage';
import AnnouncementManagementPage from './components/admin/AnnouncementManagementPage';
import AdminProfilePage from './components/AdminProfilePage';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AdminLoginPage />} />
          <Route path="/login" element={<AdminLoginPage />} />
          <Route 
            path="/dashboard" 
            element={
              <AdminProtectedRoute>
                <AdminDashboardLayout>
                  <AdminDashboardPage />
                </AdminDashboardLayout>
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <AdminProtectedRoute>
                <AdminDashboardLayout>
                  <UserManagementPage />
                </AdminDashboardLayout>
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/transactions" 
            element={
              <AdminProtectedRoute>
                <AdminDashboardLayout>
                  <TransactionManagementPage />
                </AdminDashboardLayout>
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <AdminProtectedRoute>
                <AdminDashboardLayout>
                  <NotificationPage />
                </AdminDashboardLayout>
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/announcements" 
            element={
              <AdminProtectedRoute>
                <AdminDashboardLayout>
                  <AnnouncementManagementPage />
                </AdminDashboardLayout>
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/statistics" 
            element={
              <AdminProtectedRoute>
                <AdminDashboardLayout>
                  <AdminDashboardPage />
                </AdminDashboardLayout>
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <AdminProtectedRoute>
                <AdminDashboardLayout>
                  <AdminProfilePage />
                </AdminDashboardLayout>
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <AdminProtectedRoute>
                <AdminDashboardLayout>
                  <AdminDashboardPage />
                </AdminDashboardLayout>
              </AdminProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
