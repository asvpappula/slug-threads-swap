
import { ReactNode, useState } from 'react';
import { Home, Plus, MessageCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

interface LayoutProps {
  children: ReactNode;
  currentTab: 'home' | 'sell' | 'chat' | 'dashboard';
  onTabChange: (tab: 'home' | 'sell' | 'chat' | 'dashboard') => void;
}

const Layout = ({ children, currentTab, onTabChange }: LayoutProps) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleTabClick = (tab: 'home' | 'sell' | 'chat' | 'dashboard') => {
    if ((tab === 'sell' || tab === 'chat' || tab === 'dashboard') && !isAuthenticated) {
      setShowAuthModal(true);
    } else {
      onTabChange(tab);
    }
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      onTabChange('dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-ucsc-bg font-poppins">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ucsc-navy">
              🐌 Slug Swap
            </h1>
            <p className="text-sm text-gray-600">UCSC Student Marketplace</p>
          </div>
          
          <button
            onClick={handleAuthClick}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-ucsc-gold text-ucsc-navy font-medium hover:bg-yellow-200 transition-colors"
          >
            {isAuthenticated ? (
              <>
                <img 
                  src={user?.profilePic} 
                  alt={user?.username}
                  className="w-6 h-6 rounded-full"
                />
                <span className="hidden sm:inline">{user?.username}</span>
              </>
            ) : (
              <>
                <User size={18} />
                <span className="hidden sm:inline">Login</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => handleTabClick('home')}
            className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
              currentTab === 'home'
                ? 'bg-ucsc-gold text-ucsc-navy'
                : 'text-gray-500 hover:text-ucsc-navy'
            }`}
          >
            <Home size={24} />
            <span className="text-xs mt-1 font-medium">Home</span>
          </button>

          <button
            onClick={() => handleTabClick('sell')}
            className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
              currentTab === 'sell'
                ? 'bg-ucsc-gold text-ucsc-navy'
                : 'text-gray-500 hover:text-ucsc-navy'
            }`}
          >
            <Plus size={24} />
            <span className="text-xs mt-1 font-medium">Sell</span>
          </button>

          <button
            onClick={() => handleTabClick('chat')}
            className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
              currentTab === 'chat'
                ? 'bg-ucsc-gold text-ucsc-navy'
                : 'text-gray-500 hover:text-ucsc-navy'
            }`}
          >
            <MessageCircle size={24} />
            <span className="text-xs mt-1 font-medium">Chat</span>
          </button>

          {isAuthenticated && (
            <button
              onClick={() => handleTabClick('dashboard')}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-ucsc-gold text-ucsc-navy'
                  : 'text-gray-500 hover:text-ucsc-navy'
              }`}
            >
              <User size={24} />
              <span className="text-xs mt-1 font-medium">Dashboard</span>
            </button>
          )}
        </div>
      </nav>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default Layout;
