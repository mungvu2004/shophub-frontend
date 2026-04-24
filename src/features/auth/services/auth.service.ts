import type { LoginFormValues } from "@/lib/validators";
import { apiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/api.types";
import type { TokenResponse, User } from "@/types/auth.types";

export type SocialProvider = "google" | "facebook";

const SOCIAL_AUTH_BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_BASE_URL?.trim();
const SOCIAL_CALLBACK_URL = import.meta.env.VITE_SOCIAL_AUTH_CALLBACK_URL?.trim();

const buildSocialLoginUrl = (provider: SocialProvider) => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!SOCIAL_AUTH_BASE_URL) {
    return null;
  }

  const base = SOCIAL_AUTH_BASE_URL.replace(/\/$/, "");
  const url = new URL(`${base}/${provider}`);

  if (SOCIAL_CALLBACK_URL) {
    url.searchParams.set("redirect_uri", SOCIAL_CALLBACK_URL);
  }

  return url.toString();
};

export const authService = {
  async login(payload: LoginFormValues) {
    const response = await apiClient.post<TokenResponse>("/auth/login", payload);
    return response.data;
  },
  async me() {
    const response = await apiClient.get<ApiResponse<User>>("/auth/me");
    return response.data.data;
  },
  getSocialLoginUrl(provider: SocialProvider) {
    return buildSocialLoginUrl(provider);
  },
};
