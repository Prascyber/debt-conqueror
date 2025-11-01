import { create } from 'zustand';
import { User } from '@/types';
import { authService } from '@/services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const { user, token } = await authService.login(email, password);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, token: null, isAuthenticated: false });
  },

  initialize: () => {
    const token = localStorage.getItem('auth_token');
    const user = authService.getCurrentUser();
    
    if (token && user && authService.validateToken(token)) {
      set({ user, token, isAuthenticated: true, isLoading: false });
    } else {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
