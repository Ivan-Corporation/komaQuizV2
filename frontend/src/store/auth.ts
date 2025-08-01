import { create } from 'zustand';
import api from '../api/axios';
import { API_BASE_URL } from '../config';

interface User {
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoaded: boolean; // ✅ new flag
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUserFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoaded: false, // ✅ initial state

  login: async (email, password) => {
    try {
      const response = await api.post(`${API_BASE_URL}/auth/login`, {
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
      try {
        const base64Payload = token.split('.')[1];
        const decoded = JSON.parse(atob(base64Payload));
        const email = decoded.sub;
        const exp = decoded.exp;

        // Check expiration
        if (exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          set({ token: null, user: null, isLoaded: true });
          return;
        }

        set({ token, user: { email }, isLoaded: true }); // ✅ set flag
        return;
      } catch (e) {
        localStorage.removeItem('token');
      }
    }

    set({ isLoaded: true }); // ✅ mark as loaded even if no token
  }
}));
