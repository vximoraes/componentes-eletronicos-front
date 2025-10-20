import axios, { AxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";
import { refreshAccessToken } from "./refresh-token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];
let cachedAccessToken: string | null = null;

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
    const token = cachedAccessToken || (await getSession())?.user?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const shouldRefresh = error.response?.status === 401 || error.response?.status === 498;

    if (!shouldRefresh || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const session = await getSession();

      if (!session?.user?.refreshToken) {
        throw new Error("Sem refresh token disponível");
      }

      const newAccessToken = await refreshAccessToken(session.user.refreshToken);

      if (!newAccessToken) {
        throw new Error("Falha ao renovar token de acesso");
      }

      cachedAccessToken = newAccessToken;

      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError, null);
      cachedAccessToken = null;

      await signOut({ redirect: false });
      window.location.href = "/login";
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;

export async function authenticatedRequest<T = any>(
  url: string,
  options?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await api({
      url,
      ...options,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Erro na requisição autenticada:", error.response?.data);
    }
    throw error;
  }
}
