
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ClothingItem } from '@/contexts/ClothingContext';
import { Send, ArrowLeft } from 'lucide-react';
import AuthModal from './AuthModal';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  item: ClothingItem;
  otherUser: {
    id: string;
    name: string;
    profilePic: string;
  };
  messages: Message[];
  lastMessage?: Message;
}

interface ChatPageProps {
  activeChat?: ClothingItem;
  onBackToChats: () => void;
}

const ChatPage = ({ activeChat, onBackToChats }: ChatPageProps) => {
  const { isAuthenticated, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Mock chats data
  const mockChats: Chat[] = [
    {
      id: '1',
      item: {
        id: '1',
        title: 'Slug Life Hoodie',
        description: 'Cozy UCSC hoodie',
        price: 35,
        category: 'hoodie',
        size: 'M',
        condition: 'gently-used',
        images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop'],
        userId: 'user1',
        username: 'samantha_sc',
        userProfilePic: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=50&h=50&fit=crop&crop=face',
        isSold: false,
        createdAt: new Date()
      },
      otherUser: {
        id: 'user1',
        name: 'Samantha',
        profilePic: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=50&h=50&fit=crop&crop=face'
      },
      messages: [
        {
          id: '1',
          senderId: 'user1',
          senderName: 'Samantha',
          content: 'Hey! Thanks for your interest in the hoodie!',
          timestamp: new Date(Date.now() - 3600000)
        },
        {
          id: '2',
          senderId: 'current-user',
          senderName: 'You',
          content: 'Hi! Is it still available?',
          timestamp: new Date(Date.now() - 1800000)
        }
      ]
    }
  ];

  const quickReplies = [
    "Hey! Is this still available?",
    "What's the condition like?",
    "Can we meet on campus?",
    "Would you take $X for it?"
  ];

  if (!isAuthenticated) {
    return (
      <>
        <div className="p-4 text-center py-20">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-bold text-ucsc-navy mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            You need to log in to chat with other students!
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-ucsc-gold text-ucsc-navy px-8 py-3 rounded-2xl font-semibold hover:bg-yellow-400 transition-colors"
          >
            Login / Sign Up
          </button>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || 'current-user',
      senderName: user?.username || 'You',
      content: newMessage,
      timestamp: new Date()
    };

    // In a real app, this would update the chat in the backend
    console.log('Sending message:', message);
    setNewMessage('');
  };

  if (activeChat && !selectedChat) {
    // Create a new chat for the active item
    const newChat: Chat = {
      id: Date.now().toString(),
      item: activeChat,
      otherUser: {
        id: activeChat.userId,
        name: activeChat.username,
        profilePic: activeChat.userProfilePic
      },
      messages: []
    };
    setSelectedChat(newChat);
  }

  if (selectedChat) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedChat(null);
              onBackToChats();
            }}
            className="text-ucsc-navy hover:bg-gray-100 p-2 rounded-full"
          >
            <ArrowLeft size={20} />
          </button>
          <img
            src={selectedChat.item.images[0]}
            alt={selectedChat.item.title}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-ucsc-navy">{selectedChat.item.title}</h3>
            <p className="text-sm text-gray-600">with @{selectedChat.otherUser.name}</p>
          </div>
          <span className="text-lg font-bold text-ucsc-navy">${selectedChat.item.price}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedChat.messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">👋</div>
              <p className="text-gray-600 mb-4">Start the conversation!</p>
              <div className="space-y-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => setNewMessage(reply)}
                    className="block w-full text-left bg-gray-50 hover:bg-gray-100 p-3 rounded-xl text-sm transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            selectedChat.messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.senderId === user?.id
                    ? 'bg-ucsc-navy text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.senderId === user?.id ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-3 border border-gray-200 rounded-xl focus:border-ucsc-gold focus:ring-2 focus:ring-ucsc-gold/20 outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-ucsc-navy text-white p-3 rounded-xl hover:bg-blue-900 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-ucsc-navy mb-6">Your Chats 💬</h2>

      {mockChats.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📱</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No chats yet</h3>
          <p className="text-gray-500">
            Start chatting by messaging sellers on items you're interested in!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {mockChats.map(chat => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <img
                  src={chat.item.images[0]}
                  alt={chat.item.title}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ucsc-navy truncate">{chat.item.title}</h3>
                  <p className="text-sm text-gray-600">@{chat.otherUser.name}</p>
                  {chat.lastMessage && (
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {chat.lastMessage.content}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-ucsc-navy">${chat.item.price}</span>
                  {chat.lastMessage && (
                    <p className="text-xs text-gray-500 mt-1">
                      {chat.lastMessage.timestamp.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatPage;
