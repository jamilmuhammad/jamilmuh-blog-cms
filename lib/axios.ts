import axios, { HeadersDefaults } from 'axios'
import { cookies } from 'next/headers'
import { verifyJwtAccessToken, verifyJwtRefreshToken } from './decode-token.lib';
import { toast } from 'react-toastify';

// Create axios instance.
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

type headers = {
  "Content-Type": string;
  Accept: string;
  Authorization: string;
};

axiosInstance.defaults.headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as headers & HeadersDefaults & { [key: string]: string };

// // Adding Authorization header for all requests

axiosInstance.interceptors.request.use(
  (config) => {
    const access_token = cookies().get('access_token')?.value
    if (access_token) {
      // Configure this as per your backend requirements
      config.headers!["Authorization"] = 'Bearer ' + access_token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;    

    if (originalConfig && originalConfig.url !== "auth/login/cms" && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        const access_token = cookies().get('access_token')?.value
        const refresh_token = cookies().get('refresh_token')?.value

        try {
          const rs = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth`, { refresh_token: refresh_token!, access_token: access_token! }, {
            headers: {
              Authorization: access_token!,
            },
          });
          const access = rs.data?.data?.token?.access_token;
          const hasVerifiedAccessToken = await verifyJwtAccessToken(access);
          const expAccess = (hasVerifiedAccessToken?.exp ?? 0) * 1000
          cookies().set('access_token', access, { secure: false, sameSite: 'lax', expires: expAccess })
          
          const refresh = rs.data?.data?.token?.refresh_token;
          const hasVerifiedRefreshToken = await verifyJwtRefreshToken(refresh);
          const expRefresh = (hasVerifiedRefreshToken?.exp ?? 0) * 1000
          cookies().set('refresh_token', refresh, { secure: false, sameSite: 'lax', expires: expRefresh })

          return axiosInstance(originalConfig);
        } catch (err) {          
          toast.error("Session time out. Please login again.");
          // Logging out the user by removing all the tokens from local
          cookies().delete('access_token')
          cookies().delete('refresh_token')
          localStorage.removeItem('auth-store')
          window.location.href = '/login';
          return Promise.reject(err);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;