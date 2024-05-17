import { IAuth } from '@/types/auth'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { verifyJwtAccessToken, verifyJwtRefreshToken } from '../decode-token.lib'
import Cookies from 'js-cookie';

export interface IAuthActions {
    updateAccessToken: (token: string) => void
    updateRefreshToken: (token: string) => void
    updateUserData: (data: any) => void
    login: (access_token: string, refresh_token: string, data: any) => void
    logout: () => void
}

export const useAuthStore = create<IAuth & IAuthActions>()(
    persist(
        set => ({
            access_token: null,
            refresh_token: null,
            user: null,
            updateAccessToken: async (token: string) => {
                const hasVerifiedToken = await verifyJwtAccessToken(token);
                const exp = (hasVerifiedToken?.exp ?? 0) * 1000
                Cookies.set("access_token", token, { secure: false, sameSite: 'lax', expires: exp });
                set({ access_token: token })
            },
            updateRefreshToken: async (token: string) => {
                const hasVerifiedToken = await verifyJwtRefreshToken(token);
                const exp = (hasVerifiedToken?.exp ?? 0) * 1000
                Cookies.set("refresh_token", token, { secure: false, sameSite: 'lax', expires: exp });
                set({ refresh_token: token })
            },
            updateUserData: async (data: any) => {
                set({ user: data })
            },
            login: (access_token: string, refresh_token: string, user: any) => {
                Cookies.set('access_token', access_token, { secure: false, sameSite: 'lax' });
                Cookies.set('refresh_token', refresh_token, { secure: false, sameSite: 'lax' });
                set({ access_token, refresh_token, user });
            },
            logout: () => {
                Cookies.remove("access_token")
                Cookies.remove("refresh_token")
                Cookies.remove("user")
                set({ access_token: null, refresh_token: null, user: null })
            },
        }), {
        name: 'auth-store'
    }
    )
)