
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClothing } from '@/contexts/ClothingContext';
import { Upload, X } from 'lucide-react';
import AuthModal from './AuthModal';

const SellPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { addItem } = useClothing();
  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'shirt' as const,
    size: 'M' as const,
    condition: 'gently-used' as const,
  });

  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = () => {
    // Simulate image upload with placeholder
    const placeholderImages = [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop'
    ];
    
    if (images.length < 4) {
      setImages(prev => [...prev, placeholderImages[images.length % placeholderImages.length]]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      setShowAuthModal(true);
      return;
    }

    if (images.length === 0) {
      alert('Please add at least one image');
      return;
    }

    addItem({
      ...formData,
      price: parseFloat(formData.price),
      images,
      userId: user.id,
      username: user.username,
      userProfilePic: user.profilePic || '',
      isSold: false
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      price: '',
      category: 'shirt',
      size: 'M',
      condition: 'gently-used',
    });
    setImages([]);

    alert('Item posted successfully! 🎉');
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="p-4 text-center py-20">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-ucsc-navy mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            You need to log in with your UCSC email to sell items on Slug Swap!
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

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-ucsc-navy mb-6">Sell Your Item 👕</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Photos (up to 4)
            </label>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                  <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-ucsc-gold transition-colors"
                >
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Add Photo</span>
                </button>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Cozy UCSC Hoodie"
              className="w-full p-3 border border-gray-200 rounded-xl focus:border-ucsc-gold focus:ring-2 focus:ring-ucsc-gold/20 outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us about your item! Condition, style, why you're selling..."
              className="w-full p-3 border border-gray-200 rounded-xl h-24 resize-none focus:border-ucsc-gold focus:ring-2 focus:ring-ucsc-gold/20 outline-none"
              required
            />
          </div>

          {/* Price, Category, Size, Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="25"
                min="1"
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-ucsc-gold focus:ring-2 focus:ring-ucsc-gold/20 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-ucsc-gold focus:ring-2 focus:ring-ucsc-gold/20 outline-none"
              >
                <option value="hoodie">Hoodie</option>
                <option value="shirt">Shirt</option>
                <option value="pants">Pants</option>
                <option value="dress">Dress</option>
                <option value="jacket">Jacket</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Size
              </label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value as any })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-ucsc-gold focus:ring-2 focus:ring-ucsc-gold/20 outline-none"
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Condition
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-ucsc-gold focus:ring-2 focus:ring-ucsc-gold/20 outline-none"
              >
                <option value="new">New</option>
                <option value="gently-used">Gently Used</option>
                <option value="worn">Worn</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-ucsc-navy text-white py-4 rounded-xl font-semibold hover:bg-blue-900 transition-colors"
          >
            Post Item 🚀
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellPage;
