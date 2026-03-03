import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Add login logic here
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to dashboard on successful login
      window.location.href = '/dashboard';
    }, 2000);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // Google OAuth implementation
      // For now, simulate Google login
      setTimeout(() => {
        setIsGoogleLoading(false);
        // Redirect to dashboard on successful Google login
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error) {
      console.error('Google sign in error:', error);
      setIsGoogleLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nova-primary/10 to-nova-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Form Side */}
          <main className="p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              {/* Logo */}
              <Link to="/" className="inline-block mb-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-nova-primary to-nova-secondary bg-clip-text text-transparent">
                  NovaSMSHub
                </h1>
              </Link>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Welcome Section */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back! 👋
                  </h1>
                  <p className="text-gray-600">
                    Login with your account!
                  </p>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nova-primary focus:border-transparent transition-all"
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Your password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nova-primary focus:border-transparent transition-all"
                      required
                      autoComplete="current-password"
                      title="Minimum 6 characters at least 1 Alphabet and 1 Number"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="w-4 h-4 text-nova-primary border-gray-300 rounded focus:ring-nova-primary"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-nova-primary to-nova-secondary text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      <span>Logging you in...</span>
                    </>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Actions */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <Link 
                      to="/forgot-password" 
                      className="text-nova-primary hover:text-nova-secondary transition-colors"
                    >
                      Reset Password
                    </Link>
                  </div>
                  
                  <div className="text-center text-sm text-gray-600">
                    <span>Don't have an account? </span>
                    <Link 
                      to="/register" 
                      className="text-nova-primary hover:text-nova-secondary font-semibold transition-colors"
                    >
                      Sign Up Now
                    </Link>
                  </div>
                </div>

                {/* Google Sign In */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="w-full flex items-center justify-center space-x-2 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGoogleLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                      <span>Connecting to Google...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </main>

          {/* Info Side */}
          <aside className="hidden md:flex flex-col justify-center items-center p-8 lg:p-12 bg-gradient-to-br from-nova-primary/20 to-nova-secondary/20">
            <div className="text-center space-y-6">
              <div className="w-64 h-64 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-nova-primary to-nova-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
                  <p className="text-gray-600">Your data is protected with enterprise-grade security</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <img 
                  src="/images/smshubimg.png" 
                  alt="SMS Hub Verification Service"
                  className="w-32 h-32 mx-auto rounded-lg shadow-lg object-cover"
                />
                <h2 className="text-2xl font-bold text-gray-900">
                  Join thousands of satisfied users
                </h2>
                <p className="text-gray-600 max-w-sm">
                  Experience the best SMS verification service with competitive pricing and reliable delivery.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
