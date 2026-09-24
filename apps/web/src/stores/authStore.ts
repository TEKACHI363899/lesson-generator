import { create, StateCreator } from 'zustand';
import { apiClient } from '../services/apiClient';
import { getDeviceId, getStoredToken, setStoredToken } from '../services/storage';
import { ApiResponse, UserSession } from '@eng-studio/shared-types';

interface AuthState {
  token: string | null;
  deviceId: string;
  user: UserSession | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const authStateCreator: StateCreator<AuthState> = (set) => ({
  token: getStoredToken(),
  deviceId: getDeviceId(),
  user: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const deviceId = getDeviceId();
      const res = await apiClient.post<ApiResponse<UserSession>>('/auth/login', {
        email,
        password,
        deviceId,
      });

      if (res.data.status && res.data.data) {
        setStoredToken(res.data.data.token);
        set({
          token: res.data.data.token,
          user: res.data.data,
          isLoading: false,
          error: null,
        });
        return true;
      }
      set({ isLoading: false, error: res.data.message });
      return false;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đăng nhập không thành công';
      set({ isLoading: false, error: msg });
      return false;
    }
  },

  register: async (fullName: string, email: string, password: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const deviceId = getDeviceId();
      const res = await apiClient.post<ApiResponse<UserSession>>('/auth/register', {
        fullName,
        email,
        password,
        deviceId,
      });

      if (res.data.status && res.data.data) {
        setStoredToken(res.data.data.token);
        set({
          token: res.data.data.token,
          user: res.data.data,
          isLoading: false,
          error: null,
        });
        return true;
      }
      set({ isLoading: false, error: res.data.message });
      return false;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đăng ký không thành công';
      set({ isLoading: false, error: msg });
      return false;
    }
  },

  logout: () => {
    setStoredToken(null);
    set({
      token: null,
      user: null,
      isLoading: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
});

export const useAuthStore = create<AuthState>(authStateCreator);
