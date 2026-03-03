// Admin API Configuration
const API_BASE_URL = process.env.REACT_APP_ADMIN_API_URL || 'http://localhost:5002/api/admin';

// API Helper Functions for Admin Dashboard
class AdminApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Admin Authentication
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }

  // Dashboard Statistics
  async getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  // User Management
  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async getUserById(userId: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async updateUser(userId: string, userData: any) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return response.json();
  }

  async deleteUser(userId: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  // Transaction Management
  async getTransactions() {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async updateTransactionStatus(transactionId: string, status: string, comment?: string) {
    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status, comment })
    });
    return response.json();
  }

  async getTransactionById(transactionId: string) {
    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  // Notification Management
  async getNotifications() {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async sendNotification(notificationData: any) {
    const response = await fetch(`${API_BASE_URL}/notifications/send`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(notificationData)
    });
    return response.json();
  }

  async deleteNotification(notificationId: string) {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  // Admin Profile
  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async updateProfile(profileData: any) {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return response.json();
  }

  // Payment Proof Management
  async getPaymentProofs() {
    const response = await fetch(`${API_BASE_URL}/payment-proofs`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async reviewPaymentProof(proofId: number, reviewData: { action: 'approve' | 'reject'; comment: string }) {
    const response = await fetch(`${API_BASE_URL}/payment-proofs/${proofId}/review`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reviewData)
    });
    return response.json();
  }

  // SMS Provider Management
  async getSMSProviders() {
    const response = await fetch(`${API_BASE_URL}/sms-providers`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async createSMSProvider(providerData: any) {
    const response = await fetch(`${API_BASE_URL}/sms-providers`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(providerData)
    });
    return response.json();
  }

  async updateSMSProvider(providerId: string, providerData: any) {
    const response = await fetch(`${API_BASE_URL}/sms-providers/${providerId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(providerData)
    });
    return response.json();
  }

  async deleteSMSProvider(providerId: string) {
    const response = await fetch(`${API_BASE_URL}/sms-providers/${providerId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async toggleSMSProvider(providerId: string) {
    const response = await fetch(`${API_BASE_URL}/sms-providers/${providerId}/toggle`, {
      method: 'PUT',
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  // Number Pool Management
  async getNumberPool() {
    const response = await fetch(`${API_BASE_URL}/number-pool`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async addNumbersToPool(data: { numbers: string[]; provider: string }) {
    const response = await fetch(`${API_BASE_URL}/number-pool/add`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // SMS Services Management
  async getSMSServices() {
    const response = await fetch(`${API_BASE_URL}/sms-services`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async createSMSService(serviceData: any) {
    const response = await fetch(`${API_BASE_URL}/sms-services`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(serviceData)
    });
    return response.json();
  }

  async updateSMSService(serviceId: string, serviceData: any) {
    const response = await fetch(`${API_BASE_URL}/sms-services/${serviceId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(serviceData)
    });
    return response.json();
  }

  async deleteSMSService(serviceId: string) {
    const response = await fetch(`${API_BASE_URL}/sms-services/${serviceId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  // Admin User Management
  async getAdminUsers() {
    const response = await fetch(`${API_BASE_URL}/admin-users`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async createAdminUser(userData: any) {
    const response = await fetch(`${API_BASE_URL}/admin-users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return response.json();
  }

  async updateAdminUser(userId: string, userData: any) {
    const response = await fetch(`${API_BASE_URL}/admin-users/${userId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return response.json();
  }

  async deleteAdminUser(userId: string) {
    const response = await fetch(`${API_BASE_URL}/admin-users/${userId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async toggleAdminUser(userId: string) {
    const response = await fetch(`${API_BASE_URL}/admin-users/${userId}/toggle`, {
      method: 'PUT',
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  // Financial Management
  async getFinancialStats(dateRange: string) {
    const response = await fetch(`${API_BASE_URL}/financial/stats?range=${dateRange}`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async exportFinancialData(dateRange: string) {
    const response = await fetch(`${API_BASE_URL}/financial/export?range=${dateRange}`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  // Manual Override System
  async getManualOverrides() {
    const response = await fetch(`${API_BASE_URL}/manual-overrides`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async manualBalanceUpdate(userId: string, amount: number, reason: string) {
    const response = await fetch(`${API_BASE_URL}/manual/balance-update`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ userId, amount, reason })
    });
    return response.json();
  }

  async manualTransactionUpdate(transactionId: string, status: string, reason: string) {
    const response = await fetch(`${API_BASE_URL}/manual/transaction-update`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ transactionId, status, reason })
    });
    return response.json();
  }

  async manualNumberAssignment(userId: string, number: string, service: string) {
    const response = await fetch(`${API_BASE_URL}/manual/number-assignment`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ userId, number, service })
    });
    return response.json();
  }

  // Dynamic 5Sim Integration
  async getDynamicServices(country: string, search: string) {
    const response = await fetch(`${API_BASE_URL}/dynamic/services?country=${country}&search=${search}`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async getDynamicCountries(search: string) {
    const response = await fetch(`${API_BASE_URL}/dynamic/countries?search=${search}`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async getDynamicNumbers(service: string, country: string) {
    const response = await fetch(`${API_BASE_URL}/dynamic/numbers?service=${service}&country=${country}`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  // System Health
  async getSystemHealth() {
    const response = await fetch(`${API_BASE_URL}/health`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }
}

export default new AdminApiService();
