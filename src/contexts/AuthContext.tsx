
import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  profilePic?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    if (email.includes('@ucsc.edu')) {
      const mockUser = {
        id: '1',
        username: email.split('@')[0],
        email,
        profilePic: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face'
      };
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    if (email.includes('@ucsc.edu')) {
      const mockUser = {
        id: Date.now().toString(),
        username,
        email,
        profilePic: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face'
      };
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      signup
    }}>
      {children}
    </AuthContext.Provider>
  );
};
