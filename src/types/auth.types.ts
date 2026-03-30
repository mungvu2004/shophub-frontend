export interface LoginRequest {
  email: string; // Source: Sellers.Email (login identifier) | nullable: no
  password: string; // Source: Auth request body, validated against Sellers.PasswordHash | nullable: no
}

export interface TokenResponse {
  accessToken: string; // Source: /auth/login response.AccessToken | nullable: no
  expiresIn: number; // Source: /auth/login response.ExpiresIn (seconds) | nullable: no
  tokenType: string; // Source: /auth/login response.TokenType | nullable: no
  // Source: Refresh token is backend-only (httpOnly cookie) and excluded from frontend interface.
}

export interface User {
  id: string; // Source: Sellers.Id | nullable: no
  email: string; // Source: Sellers.Email | nullable: no
  fullName?: string; // Source: Sellers.FullName | nullable: yes
  phone?: string; // Source: Sellers.Phone | nullable: yes
  subscriptionTier: "Free" | "Pro" | "Enterprise"; // Source: Sellers.SubscriptionTier | nullable: no
  roles: string[]; // Source: ASP.NET Identity role claims | nullable: no
  isActive: boolean; // Source: Sellers.IsActive | nullable: no
  createdAt: string; // Source: Sellers.CreatedAt | nullable: no
  lastLoginAt?: string; // Source: Sellers.LastLoginAt | nullable: yes
}
