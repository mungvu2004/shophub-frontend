import axios, { AxiosError } from "axios";

import { useAuthStore } from "../stores/authStore";

export type ApiError = {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const normalizeApiPath = (url: string): string => {
  return url;
};

const toApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message?: string;
      code?: string;
      details?: unknown;
      error?: string;
    }>;

    const status = axiosError.response?.status ?? 0;
    const data = axiosError.response?.data;

    return {
      status,
      message:
        data?.message ||
        data?.error ||
        axiosError.message ||
        "Unexpected API error",
      code: data?.code,
      details: data?.details,
    };
  }

  if (error instanceof Error) {
    return {
      status: 0,
      message: error.message,
    };
  }

  return {
    status: 0,
    message: "Unexpected API error",
    details: error,
  };
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (typeof config.url === "string") {
    config.url = normalizeApiPath(config.url);
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const { logout } = useAuthStore.getState();

      logout();
      window.location.assign("/login");
    }

    throw toApiError(error);
  }
);
