
import { useState } from 'react';
import { X, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email.includes('@ucsc.edu')) {
      setError('Please use your UCSC email address (@ucsc.edu)');
      setIsLoading(false);
      return;
    }

    try {
      const success = await forgotPassword(email);
      if (success) {
        setIsSuccess(true);
      } else {
        setError('Email not found or invalid');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setEmail('');
    setIsSuccess(false);
    setError('');
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
            {isSuccess ? 'Check Your Slugmail!' : 'Forgot Password?'}
          </h2>
          <p className="text-gray-600">
            {isSuccess 
              ? 'We sent you a reset link, check your slugmail!'
              : 'Enter your UCSC email to reset your password'
            }
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
              <Mail className="mx-auto mb-2" size={24} />
              <p className="text-sm">Reset link sent to {email}</p>
            </div>
            <Button onClick={handleClose} className="w-full bg-ucsc-navy">
              Got it!
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UCSC Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@ucsc.edu"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-ucsc-navy"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full"
            >
              Back to Login
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
