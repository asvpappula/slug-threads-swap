
import { useState } from 'react';
import { X, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email.includes('@ucsc.edu')) {
      setError('Please use your UCSC email address (@ucsc.edu)');
      return;
    }

    // Handle magic link
    if (useMagicLink) {
      // Simulate sending magic link
      setMagicLinkSent(true);
      return;
    }

    try {
      let success;
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        if (!formData.username.trim()) {
          setError('Username is required for sign up');
          return;
        }
        success = await signup(formData.username, formData.email, formData.password);
      }

      if (success) {
        onClose();
        setFormData({ username: '', email: '', password: '' });
        setMagicLinkSent(false);
        setUseMagicLink(false);
      } else {
        setError('Invalid credentials or email not verified');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const handleClose = () => {
    onClose();
    setMagicLinkSent(false);
    setUseMagicLink(false);
    setError('');
    setFormData({ username: '', email: '', password: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-ucsc-navy mb-2">
            {magicLinkSent ? 'Check Your Email!' : (isLogin ? 'Welcome Back!' : 'Join Slug Swap')}
          </h2>
          <p className="text-gray-600">
            {magicLinkSent 
              ? 'We sent a magic link to your UCSC email'
              : (isLogin 
                ? 'Log in to your UCSC account' 
                : 'Create your UCSC student account'
              )
            }
          </p>
        </div>

        {magicLinkSent ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
              <Mail className="mx-auto mb-2" size={24} />
              <p className="text-sm">Check your inbox and click the link to log in!</p>
            </div>
            <button
              onClick={() => setMagicLinkSent(false)}
              className="text-ucsc-navy hover:underline text-sm"
            >
              Back to login form
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !useMagicLink && (
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

            {!useMagicLink && (
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
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-ucsc-navy text-white py-3 rounded-xl font-semibold hover:bg-blue-900 transition-colors"
            >
              {useMagicLink ? 'Send Magic Link' : (isLogin ? 'Log In' : 'Sign Up')}
            </button>

            {isLogin && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setUseMagicLink(!useMagicLink)}
                  className="text-ucsc-navy hover:underline text-sm"
                >
                  {useMagicLink ? 'Use password instead' : 'Use magic link (easier!)'}
                </button>
              </div>
            )}
          </form>
        )}

        {!magicLinkSent && (
          <div className="text-center mt-4">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setUseMagicLink(false);
                setError('');
              }}
              className="text-ucsc-navy hover:underline text-sm"
            >
              {isLogin 
                ? "Don't have an account? Sign up"
                : "Already have an account? Log in"
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
