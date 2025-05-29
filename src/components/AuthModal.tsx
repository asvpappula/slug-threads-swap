
import { useState } from 'react';
import { X, Mail, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ForgotPasswordModal from './ForgotPasswordModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UCSC_COLLEGES = [
  'Cowell College',
  'Stevenson College',
  'Crown College',
  'Merrill College',
  'Porter College',
  'Kresge College',
  'Oakes College',
  'Rachel Carson College',
  'College Nine',
  'College Ten'
];

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    college: '',
    studentId: '',
    profilePic: ''
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
      setMagicLinkSent(true);
      return;
    }

    try {
      let success;
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        if (!formData.username.trim() || !formData.fullName.trim() || !formData.college || !formData.studentId.trim()) {
          setError('Please fill in all required fields');
          return;
        }
        success = await signup({
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          college: formData.college,
          studentId: formData.studentId,
          profilePic: formData.profilePic
        });
      }

      if (success) {
        handleClose();
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
    setFormData({ fullName: '', username: '', email: '', password: '', college: '', studentId: '', profilePic: '' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a service like Supabase Storage
      const mockUrl = 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face';
      setFormData({ ...formData, profilePic: mockUrl });
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          >
            <X size={24} />
          </button>

          <div className="p-6">
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
                {!isLogin && (
                  <>
                    {/* Profile Picture Upload */}
                    <div className="text-center">
                      <div className="relative mx-auto w-20 h-20 mb-2">
                        <img 
                          src={formData.profilePic || 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face'} 
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover border-2 border-ucsc-gold"
                        />
                        <label className="absolute bottom-0 right-0 bg-ucsc-gold text-ucsc-navy p-1 rounded-full cursor-pointer hover:bg-yellow-200">
                          <Upload size={12} />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">Upload UCSC ID Photo (Optional)</p>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Your full name"
                        className="w-full p-3 border border-gray-200 rounded-xl focus:border-ucsc-gold focus:ring-2 focus:ring-ucsc-gold/20 outline-none"
                        required
                      />
                    </div>

                    {/* Username */}
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
                  </>
                )}

                {/* Email */}
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

                {!isLogin && (
                  <>
                    {/* College */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        UCSC College
                      </label>
                      <Select value={formData.college} onValueChange={(value) => setFormData({ ...formData, college: value })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your college" />
                        </SelectTrigger>
                        <SelectContent>
                          {UCSC_COLLEGES.map((college) => (
                            <SelectItem key={college} value={college}>
                              {college}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Student ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        UCSC Student ID Number
                      </label>
                      <input
                        type="text"
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        placeholder="1234567"
                        className="w-full p-3 border border-gray-200 rounded-xl focus:border-ucsc-gold focus:ring-2 focus:ring-ucsc-gold/20 outline-none"
                        required
                      />
                    </div>
                  </>
                )}

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
                  <>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setUseMagicLink(!useMagicLink)}
                        className="text-ucsc-navy hover:underline text-sm"
                      >
                        {useMagicLink ? 'Use password instead' : 'Use magic link (easier!)'}
                      </button>
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-ucsc-navy hover:underline text-sm"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </>
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
      </div>

      <ForgotPasswordModal 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </>
  );
};

export default AuthModal;
