import type { TokenResponse, User } from "@/types/auth.types";

export const MOCK_AUTH_CREDENTIAL = {
  email: "seller@shophub.vn",
  password: "password123",
};

export const MOCK_TOKEN_RESPONSE: TokenResponse = {
  accessToken: "mock-jwt-access-token",
  expiresIn: 3600,
  tokenType: "Bearer",
};

export const MOCK_CURRENT_USER: User = {
  id: "seller-001",
  email: "seller@shophub.vn",
  fullName: "ShopHub Seller",
  phone: "0900000000",
  subscriptionTier: "Pro",
  roles: ["Seller"],
  isActive: true,
  createdAt: "2026-01-10T08:00:00Z",
  lastLoginAt: "2026-03-29T09:15:00Z",
};
