import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  nativeLanguage: string;
  appLanguage: string;
  preferredVoice: 'male' | 'female';
  dailyStreak: number;
  wordsLearned: number;
  xpPoints: number;
  totalEarned: number;
  completedCourses: string[];
}

interface UserContextType {
  user: User;
  updateUser: (updates: Partial<User>) => void;
  processPayment: (amount: number, description: string) => Promise<boolean>;
  addEarnings: (amount: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    nativeLanguage: 'English',
    appLanguage: 'English',
    preferredVoice: 'female',
    dailyStreak: 7,
    wordsLearned: 156,
    xpPoints: 2340,
    totalEarned: 48.00,
    completedCourses: []
  });

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const processPayment = async (amount: number, description: string): Promise<boolean> => {
    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would integrate with Stripe, PayPal, etc.
        console.log(`Processing payment: $${amount.toFixed(2)} for ${description}`);
        resolve(true); // Simulate successful payment
      }, 1500);
    });
  };

  const addEarnings = (amount: number) => {
    setUser(prev => ({ 
      ...prev, 
      totalEarned: prev.totalEarned + amount
    }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, processPayment, addEarnings }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}