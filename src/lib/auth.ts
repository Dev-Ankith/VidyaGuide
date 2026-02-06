// Simple auth utilities using localStorage
// In production, this would connect to a real backend

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

const AUTH_KEY = 'vidyaguide_user';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = JSON.parse(localStorage.getItem('vidyaguide_users') || '[]');
    const user = users.find((u: any) => u.email === email);
    
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }
    
    const userData: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
    
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    return userData;
  },
  
  signup: async (name: string, email: string, password: string): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = JSON.parse(localStorage.getItem('vidyaguide_users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      throw new Error('Email already registered');
    }
    
    const newUser = {
      id: crypto.randomUUID(),
      email,
      name,
      password,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem('vidyaguide_users', JSON.stringify(users));
    
    const userData: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt,
    };
    
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    return userData;
  },
  
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },
  
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_KEY);
  },
};
