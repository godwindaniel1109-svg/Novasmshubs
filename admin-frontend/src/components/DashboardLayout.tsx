import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Phone, 
  Globe, 
  ShoppingCart, 
  Receipt, 
  Wallet, 
  MessageCircle, 
  LogOut, 
  Menu, 
  X,
  User,
  BarChart3,
  Flag,
  ShoppingBag
} from 'lucide-react';
import Logo from './Logo';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName: string;
  walletBalance: string;
  profileImage?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  userName = "Handsome Dwin", 
  walletBalance = "₦140",
  profileImage = "/images/default-avatar.png" 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored user data/tokens
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    sessionStorage.clear();
    
    // Navigate to login page
    navigate('/login');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: BarChart3,
      route: '/dashboard',
      badge: null,
      mobileOnly: false
    },
    {
      name: 'Buy Number',
      icon: Phone,
      route: '/buy-number',
      badge: null,
      mobileOnly: false
    },
    {
      name: 'Buy USA Number',
      icon: Flag,
      route: '/buy-usa-number',
      badge: null,
      mobileOnly: false
    },
    {
      name: 'My Orders',
      icon: ShoppingBag,
      route: '/order-history',
      badge: '23',
      mobileOnly: false
    },
    {
      name: 'My Transactions',
      icon: Receipt,
      route: '/transaction-history',
      badge: '10',
      mobileOnly: false
    },
    {
      name: 'Support',
      icon: MessageCircle,
      route: 'https://t.me/Primesmshub',
      badge: null,
      external: true,
      mobileOnly: false
    },
    {
      name: 'Logout',
      icon: LogOut,
      route: '/logout',
      badge: null,
      mobileOnly: false
    }
  ];

  const isActiveRoute = (route: string) => {
    if (route.startsWith('http')) return false;
    return location.pathname === route;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="inline-flex items-center p-2 text-nova-navy rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <span className="sr-only">Open sidebar</span>
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link to="/dashboard" className="flex ms-2 md:me-24">
                <Logo size="small" />
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Link 
                to="/fund-wallet"
                className="hidden md:block text-nova-navy border-2 border-nova-navy hover:bg-nova-navy font-medium rounded-md text-sm px-8 py-2 text-center bg-transparent hover:text-white transition-colors"
              >
                Fund Your Wallet
              </Link>
              <Link 
                to="/fund-wallet"
                className="text-white bg-nova-navy hover:bg-nova-primary font-medium rounded-md text-sm px-3 md:px-8 py-2 text-center hover:text-white transition-colors"
              >
                Wallet Balance: {walletBalance}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen pt-24 transition-transform bg-white border-r border-gray-200 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`} aria-label="Sidebar">
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
          {/* Wallet Section */}
          <div className="p-3 mb-4 bg-gradient-to-r from-nova-primary/10 to-nova-secondary/10 rounded-lg border border-nova-primary/20">
            <div className="space-y-3">
              <Link
                to="/fund-wallet"
                className="block w-full bg-nova-primary text-nova-navy font-medium rounded-md text-sm px-3 py-2 text-center hover:bg-nova-secondary transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                Fund Your Wallet
              </Link>
              <div className="text-center">
                <span className="text-sm text-gray-600">Wallet Balance:</span>
                <Link
                  to="/fund-wallet"
                  onClick={() => setIsSidebarOpen(false)}
                  className="block text-lg font-bold text-nova-navy hover:text-nova-primary transition-colors cursor-pointer"
                >
                  {walletBalance}
                </Link>
              </div>
            </div>
          </div>

          <ul className="space-y-2 font-medium">
            {menuItems.map((item) => {
              if (item.mobileOnly && !isSidebarOpen) return null;
              
              const Icon = item.icon;
              const isActive = isActiveRoute(item.route);
              
              return (
                <li key={item.name}>
                  {item.external ? (
                    <a
                      href={item.route}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-2 text-nova-navy rounded-lg hover:bg-gray-100 group transition-colors"
                    >
                      <Icon className="w-5 h-5 text-nova-navy transition-colors" />
                      <span className="flex-1 ms-3 whitespace-nowrap">{item.name}</span>
                    </a>
                  ) : (
                    <Link
                      to={item.route}
                      className={`flex items-center p-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-nova-primary/20 text-nova-navy' 
                          : 'text-nova-navy hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setIsSidebarOpen(false);
                        if (item.name === 'Logout') {
                          handleLogout();
                        }
                      }}
                    >
                      <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-nova-primary' : 'text-nova-navy'}`} />
                      <span className="flex-1 ms-3 whitespace-nowrap">{item.name}</span>
                      {item.badge && (
                        <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="p-4 sm:ml-64 h-screen">
        <div className="p-4 mt-14">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
