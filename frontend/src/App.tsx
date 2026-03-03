import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './components/DashboardPage';
import BuyNumberPage from './components/BuyNumberPage';
import BuyUSANumberPage from './components/BuyUSANumberPage';
import MyOrdersPage from './components/MyOrdersPage';
import MyTransactionsPage from './components/MyTransactionsPage';
import SelectNumberPage from './components/SelectNumberPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import FundWalletPage from './components/FundWalletPage';
import ProfilePage from './components/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
// Admin imports
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminDashboardLayout from './components/admin/AdminDashboardLayout';
import AdminDashboardPage from './components/admin/AdminDashboardPage';
import UserManagementPage from './components/admin/UserManagementPage';
import TransactionManagementPage from './components/admin/TransactionManagementPage';
import NotificationPage from './components/admin/NotificationPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout userName="John Doe" walletBalance="₦140">
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/buy-number" 
            element={
              <ProtectedRoute>
                <DashboardLayout userName="John Doe" walletBalance="₦140">
                  <BuyNumberPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/select-number" 
            element={
              <ProtectedRoute>
                <DashboardLayout userName="John Doe" walletBalance="₦140">
                  <SelectNumberPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order-confirmation" 
            element={
              <ProtectedRoute>
                <DashboardLayout userName="John Doe" walletBalance="₦140">
                  <OrderConfirmationPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          {/* Placeholder routes for other pages */}
          <Route 
            path="/buy-usa-number" 
            element={
              <ProtectedRoute>
                <DashboardLayout userName="John Doe" walletBalance="₦140">
                  <BuyUSANumberPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order-history" 
            element={
              <ProtectedRoute>
                <DashboardLayout userName="John Doe" walletBalance="₦140">
                  <MyOrdersPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transaction-history" 
            element={
              <ProtectedRoute>
                <DashboardLayout userName="John Doe" walletBalance="₦140">
                  <MyTransactionsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <DashboardLayout userName="John Doe" walletBalance="₦140" profileImage="/images/default-avatar.png">
                  <ProfilePage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/fund-wallet" 
            element={
              <ProtectedRoute>
                <DashboardLayout userName="John Doe" walletBalance="₦140" profileImage="/images/default-avatar.png">
                  <FundWalletPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminDashboardLayout>
                <AdminDashboardPage />
              </AdminDashboardLayout>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <AdminDashboardLayout>
                <UserManagementPage />
              </AdminDashboardLayout>
            } 
          />
          <Route 
            path="/admin/transactions" 
            element={
              <AdminDashboardLayout>
                <TransactionManagementPage />
              </AdminDashboardLayout>
            } 
          />
          <Route 
            path="/admin/notifications" 
            element={
              <AdminDashboardLayout>
                <NotificationPage />
              </AdminDashboardLayout>
            } 
          />
          <Route 
            path="/admin/statistics" 
            element={
              <AdminDashboardLayout>
                <AdminDashboardPage />
              </AdminDashboardLayout>
            } 
          />
          <Route 
            path="/admin/settings" 
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
