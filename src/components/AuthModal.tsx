
import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email.includes('@ucsc.edu')) {
      setError('Please use your UCSC email address');
      return;
    }

    try {
      let success;
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await signup(formData.username, formData.email, formData.password);
      }

      if (success) {
        onClose();
        setFormData({ username: '', email: '', password: '' });
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-ucsc-navy mb-2">
            {isLogin ? 'Welcome Back!' : 'Join Slug Swap'}
          </h2>
          <p className="text-gray-600">
            {isLogin 
              ? 'Log in to your UCSC account' 
              : 'Create your UCSC student account'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="johndoe"
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-ucsc-gold focus:ring-2 focus:ring-ucsc-gold/20 outline-none"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              UCSC Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="yourname@ucsc.edu"
              className="w-full p-3 border border-gray-200 rounded-xl focus:border-ucsc-gold focus:ring-2 focus:ring-ucsc-gold/20 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full p-3 border border-gray-200 rounded-xl focus:border-ucsc-gold focus:ring-2 focus:ring-ucsc-gold/20 outline-none"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-ucsc-navy text-white py-3 rounded-xl font-semibold hover:bg-blue-900 transition-colors"
          >
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-ucsc-navy hover:underline text-sm"
          >
            {isLogin 
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
