import { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  soldAt?: Date;
}

interface ClothingContextType {
  items: ClothingItem[];
  addItem: (item: Omit<ClothingItem, 'id' | 'createdAt'>) => void;
  getUserItems: (userId: string) => ClothingItem[];
  deleteItem: (itemId: string, userId: string) => Promise<boolean>;
  markAsSold: (itemId: string, userId: string) => Promise<boolean>;
}

const ClothingContext = createContext<ClothingContextType | undefined>(undefined);

export const useClothing = () => {
  const context = useContext(ClothingContext);
  if (context === undefined) {
    throw new Error('useClothing must be used within a ClothingProvider');
  }
  return context;
};

export const ClothingProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ClothingItem[]>([]);

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

  const deleteItem = async (itemId: string, userId: string) => {
    try {
      const item = items.find(i => i.id === itemId);
      if (!item || item.userId !== userId) {
        return false;
      }

      // Delete from database
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting item:', error);
        return false;
      }

      // Update local state
      setItems(prev => prev.filter(i => i.id !== itemId));
      return true;
    } catch (error) {
      console.error('Error in deleteItem:', error);
      return false;
    }
  };

  const markAsSold = async (itemId: string, userId: string) => {
    try {
      const item = items.find(i => i.id === itemId);
      if (!item || item.userId !== userId) {
        return false;
      }

      const soldAt = new Date();

      // Update in database
      const { error } = await supabase
        .from('items')
        .update({ 
          is_sold: true,
          sold_at: soldAt.toISOString()
        })
        .eq('id', itemId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error marking item as sold:', error);
        return false;
      }

      // Update local state
      setItems(prev => prev.map(i => 
        i.id === itemId 
          ? { ...i, isSold: true, soldAt } 
          : i
      ));

      // Schedule auto-removal after 24 hours
      setTimeout(() => {
        deleteItem(itemId, userId);
      }, 24 * 60 * 60 * 1000); // 24 hours

      return true;
    } catch (error) {
      console.error('Error in markAsSold:', error);
      return false;
    }
  };

  return (
    <ClothingContext.Provider value={{
      items,
      addItem,
      getUserItems,
      deleteItem,
      markAsSold
    }}>
      {children}
    </ClothingContext.Provider>
  );
};