
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

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
  loadItems: () => Promise<void>;
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
  const { user } = useAuth();

  const loadItems = async () => {
    try {
      // Use any type temporarily until Supabase regenerates types
      const { data, error } = await (supabase as any)
        .from('items')
        .select(`
          *,
          profiles:user_id (
            username,
            profile_pic
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading items:', error);
        return;
      }

      const formattedItems: ClothingItem[] = data?.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        price: item.price,
        category: item.category,
        size: item.size,
        condition: item.condition,
        images: item.images || [],
        userId: item.user_id,
        username: item.profiles?.username || 'Unknown User',
        userProfilePic: item.profiles?.profile_pic || '/placeholder.svg',
        isSold: item.is_sold || false,
        createdAt: new Date(item.created_at),
        soldAt: item.sold_at ? new Date(item.sold_at) : undefined
      })) || [];

      setItems(formattedItems);
    } catch (error) {
      console.error('Error in loadItems:', error);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const addItem = async (newItem: Omit<ClothingItem, 'id' | 'createdAt'>) => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('items')
        .insert({
          title: newItem.title,
          description: newItem.description,
          price: newItem.price,
          category: newItem.category,
          size: newItem.size,
          condition: newItem.condition,
          images: newItem.images,
          user_id: user.id,
          is_sold: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding item:', error);
        return;
      }

      const item: ClothingItem = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        price: data.price,
        category: data.category,
        size: data.size,
        condition: data.condition,
        images: data.images || [],
        userId: data.user_id,
        username: user.username,
        userProfilePic: user.profilePic,
        isSold: false,
        createdAt: new Date(data.created_at)
      };

      setItems(prev => [item, ...prev]);
    } catch (error) {
      console.error('Error in addItem:', error);
    }
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

      // Don't allow deletion if item is sold
      if (item.isSold) {
        return false;
      }

      const { error } = await (supabase as any)
        .from('items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting item:', error);
        return false;
      }

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

      const { error } = await (supabase as any)
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

      setItems(prev => prev.map(i => 
        i.id === itemId 
          ? { ...i, isSold: true, soldAt } 
          : i
      ));

      // Schedule auto-removal after 24 hours
      setTimeout(() => {
        deleteItem(itemId, userId);
      }, 24 * 60 * 60 * 1000);

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
      markAsSold,
      loadItems
    }}>
      {children}
    </ClothingContext.Provider>
  );
};
