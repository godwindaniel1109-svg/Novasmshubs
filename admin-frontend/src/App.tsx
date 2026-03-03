import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboardLayout from './components/AdminDashboardLayout';
import AdminDashboardPage from './components/AdminDashboardPage';
import UserManagementPage from './components/UserManagementPage';
import TransactionManagementPage from './components/TransactionManagementPage';
import NotificationPage from './components/NotificationPage';
import AdminProfilePage from './components/AdminProfilePage';
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
              <AdminDashboardLayout>
                <AdminDashboardPage />
              </AdminDashboardLayout>
            } 
          />
          <Route 
            path="/users" 
            element={
              <AdminDashboardLayout>
                <UserManagementPage />
              </AdminDashboardLayout>
            } 
          />
          <Route 
            path="/transactions" 
            element={
              <AdminDashboardLayout>
                <TransactionManagementPage />
              </AdminDashboardLayout>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <AdminDashboardLayout>
                <NotificationPage />
              </AdminDashboardLayout>
            } 
          />
          <Route 
            path="/statistics" 
            element={
              <AdminDashboardLayout>
                <AdminDashboardPage />
              </AdminDashboardLayout>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <AdminDashboardLayout>
                <AdminProfilePage />
              </AdminDashboardLayout>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <AdminDashboardLayout>
                <AdminDashboardPage />
              </AdminDashboardLayout>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
