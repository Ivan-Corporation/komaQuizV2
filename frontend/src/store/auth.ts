import { create } from 'zustand';
import api from '../api/axios';

interface User {
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUserFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  login: async (email, password) => {
    try {
      const response = await api.post('http://localhost:8000/auth/login', {
        username: email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token } = response.data;

      localStorage.setItem('token', access_token);
      set({ token: access_token, user: { email } });
    } catch (err) {
      throw new Error('Invalid credentials');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },

  loadUserFromStorage: () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode or assume user email is encoded in JWT's `sub`
      const base64Payload = token.split('.')[1];
      const decoded = JSON.parse(atob(base64Payload));
      const email = decoded.sub;

      set({ token, user: { email } });
    }
  },
}));
