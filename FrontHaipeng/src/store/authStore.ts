import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../api';

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    user: {
        username: string;
        role: 'admin';
    } | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            token: null,
            user: null,
            login: async (username, password) => {
                try {
                    const data = await api.auth.login(username, password);
                    set({
                        isAuthenticated: true,
                        token: data.access_token,
                        user: { username: data.user.username, role: 'admin' }
                    });
                    return true;
                } catch {
                    return false;
                }
            },
            logout: () => {
                set({ isAuthenticated: false, token: null, user: null });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
