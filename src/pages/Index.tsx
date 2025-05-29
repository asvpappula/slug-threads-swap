
import { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ClothingProvider, ClothingItem } from '@/contexts/ClothingContext';
import Layout from '@/components/Layout';
import HomePage from '@/components/HomePage';
import SellPage from '@/components/SellPage';
import ChatPage from '@/components/ChatPage';

const Index = () => {
  const [currentTab, setCurrentTab] = useState<'home' | 'sell' | 'chat'>('home');
  const [activeChatItem, setActiveChatItem] = useState<ClothingItem | undefined>();

  const handleStartChat = (item: ClothingItem) => {
    setActiveChatItem(item);
    setCurrentTab('chat');
  };

  const handleBackToChats = () => {
    setActiveChatItem(undefined);
  };

  const renderCurrentPage = () => {
    switch (currentTab) {
      case 'home':
        return <HomePage onStartChat={handleStartChat} />;
      case 'sell':
        return <SellPage />;
      case 'chat':
        return (
          <ChatPage 
            activeChat={activeChatItem} 
            onBackToChats={handleBackToChats}
          />
        );
      default:
        return <HomePage onStartChat={handleStartChat} />;
    }
  };

  return (
    <AuthProvider>
      <ClothingProvider>
        <Layout currentTab={currentTab} onTabChange={setCurrentTab}>
          {renderCurrentPage()}
        </Layout>
      </ClothingProvider>
    </AuthProvider>
  );
};

export default Index;
