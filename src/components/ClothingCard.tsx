
import { MessageCircle } from 'lucide-react';
import { ClothingItem } from '@/contexts/ClothingContext';
import { useAuth } from '@/contexts/AuthContext';

interface ClothingCardProps {
  item: ClothingItem;
  onMessageSeller: (item: ClothingItem) => void;
}

const ClothingCard = ({ item, onMessageSeller }: ClothingCardProps) => {
  const { isAuthenticated } = useAuth();

  const handleMessageClick = () => {
    if (!isAuthenticated) {
      alert('Please log in to message sellers!');
      return;
    }
    onMessageSeller(item);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'gently-used': return 'bg-blue-100 text-blue-800';
      case 'worn': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="aspect-square overflow-hidden">
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-ucsc-navy text-lg leading-tight">
            {item.title}
          </h3>
          <span className="text-xl font-bold text-ucsc-navy">
            ${item.price}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex gap-2 mb-3">
          <span className="bg-ucsc-lavender text-ucsc-navy px-2 py-1 rounded-full text-xs font-medium">
            {item.size}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
            {item.condition.replace('-', ' ')}
          </span>
        </div>

        {/* Seller Info & Message Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={item.userProfilePic}
              alt={item.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm text-gray-600 font-medium">
              @{item.username}
            </span>
          </div>

          <button
            onClick={handleMessageClick}
            className="bg-ucsc-gold hover:bg-yellow-400 text-ucsc-navy px-4 py-2 rounded-full font-medium text-sm flex items-center gap-1 transition-colors"
          >
            <MessageCircle size={16} />
            Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClothingCard;
