
import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'teacher' | 'student' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS = {
  teachers: [
    { id: 't1', name: 'Professor Smith', email: 'teacher@example.com', password: 'password', role: 'teacher' as UserRole },
  ],
  students: [
    { id: 's1', name: 'John Doe', email: 'student@example.com', password: 'password', role: 'student' as UserRole },
  ]
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let foundUser = null;
    
    if (role === 'teacher') {
      foundUser = MOCK_USERS.teachers.find(
        u => u.email === email && u.password === password
      );
    } else if (role === 'student') {
      foundUser = MOCK_USERS.students.find(
        u => u.email === email && u.password === password
      );
    }
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
