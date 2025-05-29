
import { ReactNode } from 'react';
import { Home, Plus, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
  currentTab: 'home' | 'sell' | 'chat';
  onTabChange: (tab: 'home' | 'sell' | 'chat') => void;
}

const Layout = ({ children, currentTab, onTabChange }: LayoutProps) => {
  const { isAuthenticated } = useAuth();

  const handleTabClick = (tab: 'home' | 'sell' | 'chat') => {
    if ((tab === 'sell' || tab === 'chat') && !isAuthenticated) {
      // For demo purposes, we'll still allow navigation but show auth prompt
      onTabChange(tab);
    } else {
      onTabChange(tab);
    }
  };

  return (
    <div className="min-h-screen bg-ucsc-bg font-poppins">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-2xl font-bold text-ucsc-navy">
            🐌 Slug Swap
          </h1>
          <p className="text-sm text-gray-600">UCSC Student Marketplace</p>
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
        </div>
      </nav>
    </div>
  );
};

export default Layout;
