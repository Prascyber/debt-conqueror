import { User } from '@/types';

// Mock JWT token generation
const generateToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    userId, 
    exp: Date.now() + 3600000 // 1 hour
  }));
  const signature = btoa(`mock-signature-${userId}`);
  return `${header}.${payload}.${signature}`;
};

// Mock users database
const mockUsers: Record<string, User> = {
  'admin@esolve.com': {
    id: '1',
    name: 'Admin User',
    email: 'admin@esolve.com',
    role: 'admin'
  },
  'agent@esolve.com': {
    id: '2',
    name: 'Agent User',
    email: 'agent@esolve.com',
    role: 'agent'
  }
};

export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockUsers[email];
    if (!user || password !== 'password123') {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user.id);
    return { user: { ...user, token }, token };
  },

  logout: async (): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  validateToken: (token: string): boolean => {
    try {
      const [, payload] = token.split('.');
      const decoded = JSON.parse(atob(payload));
      return decoded.exp > Date.now();
    } catch {
      return false;
    }
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
};
