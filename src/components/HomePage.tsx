
import { useState } from 'react';
import { useClothing } from '@/contexts/ClothingContext';
import { ClothingItem } from '@/contexts/ClothingContext';
import ClothingCard from './ClothingCard';
import { Filter } from 'lucide-react';

interface HomePageProps {
  onStartChat: (item: ClothingItem) => void;
}

const HomePage = ({ onStartChat }: HomePageProps) => {
  const { items } = useClothing();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'hoodie', 'shirt', 'pants', 'dress', 'jacket', 'shoes', 'accessories'];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory && !item.isSold;
  });

  return (
    <div className="p-4">
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for clothes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-4 pr-12 rounded-2xl border border-gray-200 focus:border-ucsc-gold focus:ring-2 focus:ring-ucsc-gold/20 outline-none transition-all"
          />
          <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-ucsc-navy text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-ucsc-gold'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-ucsc-gold to-ucsc-peach rounded-2xl p-6 mb-6 text-ucsc-navy">
        <h2 className="text-xl font-bold mb-2">Welcome to Slug Swap! 🐌</h2>
        <p className="text-sm opacity-80">
          Find amazing pre-loved clothes from fellow UCSC students. Sustainable fashion made easy!
        </p>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🐌</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map(item => (
            <ClothingCard
              key={item.id}
              item={item}
              onMessageSeller={onStartChat}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
