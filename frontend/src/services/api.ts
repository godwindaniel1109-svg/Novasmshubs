import { io, Socket } from 'socket.io-client';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Socket.io instance
let socket: Socket | null = null;

// Initialize socket connection
export const initializeSocket = (userId: string) => {
  if (socket) {
    socket.disconnect();
  }
  
  socket = io(SOCKET_URL, {
    auth: {
      userId
    }
  });

  socket.on('connect', () => {
    console.log('Connected to server');
    socket?.emit('join-user-room', userId);
  });

  socket.on('balance-changed', (data) => {
    console.log('Balance updated:', data);
    // Trigger custom event for components to listen
    window.dispatchEvent(new CustomEvent('balance-updated', { detail: data }));
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  return socket;
};

// Get socket instance
export const getSocket = () => socket;

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// API Helper Functions
class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // User Authentication
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }

  async register(userData: any) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  }

  // User Profile
  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async updateProfile(profileData: any) {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return response.json();
  }

  // Submit payment proof
  async submitPaymentProof(formData: FormData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/transactions/proof`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    return response.json();
  }

  // Wallet & Transactions
  async getWalletBalance() {
    const response = await fetch(`${API_BASE_URL}/wallet/balance`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async getTransactions() {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async fundWallet(amount: number, method: string) {
    const response = await fetch(`${API_BASE_URL}/wallet/fund`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ amount, method })
    });
    return response.json();
  }

  // Phone Numbers & Orders
  async getAvailableNumbers(country: string) {
    const response = await fetch(`${API_BASE_URL}/numbers/available?country=${country}`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async buyNumber(numberData: any) {
    const response = await fetch(`${API_BASE_URL}/numbers/buy`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(numberData)
    });
    return response.json();
  }

  async getOrders() {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  // Countries & Services
  async getCountries() {
    const response = await fetch(`${API_BASE_URL}/countries`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async getServices(country: string) {
    const response = await fetch(`${API_BASE_URL}/services?country=${country}`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }
}

export default new ApiService();
