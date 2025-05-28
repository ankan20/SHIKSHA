"use client"; // This line ensures it's a Client Component

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the user type
interface User {
  id: string;
  username: string;
  role: string;
}

// Define context types
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create the context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
