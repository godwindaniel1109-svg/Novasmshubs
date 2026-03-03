import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, Globe, Zap, CheckCircle, Users, DollarSign, MessageCircle, Facebook, Instagram, Twitter, Menu, X } from 'lucide-react';
import Logo from './Logo';

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Logo size="small" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-nova-primary to-nova-secondary bg-clip-text text-transparent">
                NovaSMSHub
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-nova-primary transition-colors">
                <Shield className="w-4 h-4" />
                <span>Buy Number</span>
              </a>
              <button className="bg-nova-primary text-black px-6 py-2 rounded-full font-semibold hover:bg-nova-secondary transition-colors">
                <Link to="/register" className="text-inherit no-underline">
                  Sign Up
                </Link>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-nova-primary transition-colors py-2">
                <Shield className="w-4 h-4" />
                <span>Buy Number</span>
              </a>
              <button className="bg-nova-primary text-black px-6 py-2 rounded-full font-semibold hover:bg-nova-secondary transition-colors mt-2 w-full">
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-nova-primary/10 to-nova-secondary/10"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-gray-900">Verify more for</span>
                <br />
                <span className="bg-gradient-to-r from-nova-primary to-nova-secondary bg-clip-text text-transparent">
                  less with NovaSMSHub
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
                Don't feel comfortable giving out your phone number? Protect your online identity by using our virtual phone numbers.
              </p>
              <button className="bg-nova-primary text-black px-8 py-3 rounded-full font-semibold text-lg hover:bg-nova-secondary transition-all transform hover:scale-105 shadow-lg">
                <Link to="/login" className="text-inherit no-underline">
                  Buy Number
                </Link>
              </button>
            </div>
            <div className="relative">
              <img 
                src="/images/looking sms.png" 
                alt="SMS Verification" 
                className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">Live Verification</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Over 500+ available countries & services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              At NovaSMSHub, we pride ourselves on providing the highest quality SMS verifications for your SMS verification needs. We make sure to only provide non-VoIP phone numbers in order to work with any service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Globe className="w-12 h-12 text-nova-primary mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hassle-free SMS Verification</h3>
              <p className="text-gray-600">Don't feel comfortable giving out your phone number? Protect your online identity by using our virtual phone numbers.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <DollarSign className="w-12 h-12 text-nova-primary mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Price Fluctuation</h3>
              <p className="text-gray-600">Our numbers start at 2 cents each, and our prices never fluctuate, even during high demand!</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Zap className="w-12 h-12 text-nova-primary mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Efficiency</h3>
              <p className="text-gray-600">Don't feel comfortable giving out your phone number? Protect your online identity by using our virtual phone numbers.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <CheckCircle className="w-12 h-12 text-nova-primary mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">High Quality</h3>
              <p className="text-gray-600">We provide only non-VoIP phone numbers to ensure compatibility with any service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Showcase Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful SMS Verification Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform provides comprehensive SMS verification solutions with advanced features and reliable delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="relative">
              <img 
                src="/images/Email-Marketing-Driven-Element-1.webp" 
                alt="SMS Element 1" 
                className="w-full h-48 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute top-4 left-4 bg-nova-primary text-black px-3 py-1 rounded-full text-sm font-semibold">
                Fast Delivery
              </div>
            </div>

            <div className="relative">
              <img 
                src="/images/Email-Marketing-Newsletter-Image.webp" 
                alt="SMS Newsletter" 
                className="w-full h-64 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute bottom-4 right-4 bg-nova-secondary text-black px-3 py-1 rounded-full text-sm font-semibold">
                Global Coverage
              </div>
            </div>

            <div className="relative">
              <img 
                src="/images/Email-Marketing-Blog-Image-2.webp" 
                alt="SMS Blog" 
                className="w-full h-48 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute top-4 right-4 bg-nova-navy text-white px-3 py-1 rounded-full text-sm font-semibold">
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-nova-primary/10 to-nova-secondary/10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img 
                src="/images/Email-Marketing-Driven-Element-2.webp" 
                alt="Trust Element" 
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Trusted by over <span className="bg-gradient-to-r from-nova-primary to-nova-secondary bg-clip-text text-transparent">5000 clients</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our numbers start at 2 cents each, and our prices never fluctuate, even during high demand!
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-nova-primary" />
                  <span className="text-gray-700">Get A Number For As Low As ₦500</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-nova-primary" />
                  <span className="text-gray-700">100% Discount Prices.</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-nova-primary" />
                  <span className="text-gray-700">100% Fast SMS Webhook System.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-nova-navy text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get started for free</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            The service we offer is designed to meet your business needs.
          </p>
          <button className="bg-white text-nova-navy px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
            <Link to="/register" className="text-inherit no-underline">
              Start for Free
            </Link>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Logo size="small" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-nova-primary to-nova-secondary bg-clip-text text-transparent">
                  NovaSMSHub
                </h3>
              </div>
              <p className="text-gray-400">
                We are trusted by over 50000+ clients. Join them now and grow your business.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-400 hover:text-nova-primary transition-colors">Login</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-nova-primary transition-colors">Register</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-nova-primary transition-colors">Buy Number</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://t.me/Primesmshub" className="flex items-center space-x-2 text-gray-400 hover:text-nova-primary transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>Telegram</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Social Media</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-nova-primary transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-nova-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-nova-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
