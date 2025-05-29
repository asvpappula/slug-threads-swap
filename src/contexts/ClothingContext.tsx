
import { createContext, useContext, useState, ReactNode } from 'react';

export interface ClothingItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'hoodie' | 'shirt' | 'pants' | 'dress' | 'jacket' | 'shoes' | 'accessories';
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  condition: 'new' | 'gently-used' | 'worn';
  images: string[];
  userId: string;
  username: string;
  userProfilePic: string;
  isSold: boolean;
  createdAt: Date;
}

interface ClothingContextType {
  items: ClothingItem[];
  addItem: (item: Omit<ClothingItem, 'id' | 'createdAt'>) => void;
  getUserItems: (userId: string) => ClothingItem[];
}

const ClothingContext = createContext<ClothingContextType | undefined>(undefined);

export const useClothing = () => {
  const context = useContext(ClothingContext);
  if (context === undefined) {
    throw new Error('useClothing must be used within a ClothingProvider');
  }
  return context;
};

// Mock data for initial items
const mockItems: ClothingItem[] = [
  {
    id: '1',
    title: 'Slug Life Hoodie',
    description: 'Cozy UCSC hoodie, perfect for those foggy Santa Cruz mornings!',
    price: 35,
    category: 'hoodie',
    size: 'M',
    condition: 'gently-used',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop'],
    userId: 'user1',
    username: 'samantha_sc',
    userProfilePic: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=50&h=50&fit=crop&crop=face',
    isSold: false,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Vintage Band Tee',
    description: 'Super soft vintage band t-shirt, one of a kind!',
    price: 18,
    category: 'shirt',
    size: 'S',
    condition: 'worn',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'],
    userId: 'user2',
    username: 'alex_music',
    userProfilePic: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=50&h=50&fit=crop&crop=face',
    isSold: false,
    createdAt: new Date('2024-01-14')
  },
  {
    id: '3',
    title: 'High-waisted Jeans',
    description: 'Cute high-waisted jeans, great for campus walks!',
    price: 28,
    category: 'pants',
    size: 'M',
    condition: 'gently-used',
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop'],
    userId: 'user3',
    username: 'emma_style',
    userProfilePic: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=50&h=50&fit=crop&crop=face',
    isSold: false,
    createdAt: new Date('2024-01-13')
  }
];

export const ClothingProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ClothingItem[]>(mockItems);

  const addItem = (newItem: Omit<ClothingItem, 'id' | 'createdAt'>) => {
    const item: ClothingItem = {
      ...newItem,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setItems(prev => [item, ...prev]);
  };

  const getUserItems = (userId: string) => {
    return items.filter(item => item.userId === userId);
  };

  return (
    <ClothingContext.Provider value={{
      items,
      addItem,
      getUserItems
    }}>
      {children}
    </ClothingContext.Provider>
  );
};
