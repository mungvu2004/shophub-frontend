import type { TokenResponse, User } from "@/types/auth.types";

export const MOCK_AUTH_CREDENTIAL = {
  email: "minh.nguyen@shophub.vn",
  password: "password123",
};

export const MOCK_TOKEN_RESPONSE: TokenResponse = {
  accessToken: "mock-jwt-access-token-seller-001",
  expiresIn: 3600,
  tokenType: "Bearer",
};

// All mock users in the system
export const MOCK_USERS: User[] = [
  {
    id: "seller-001",
    email: "minh.nguyen@shophub.vn",
    fullName: "Nguyễn Hoàng Minh",
    phone: "+84 909 123 456",
    subscriptionTier: "Pro",
    roles: ["Owner", "Admin"],
    isActive: true,
    createdAt: "2026-05-05T08:00:00Z",
    lastLoginAt: "2026-05-05T09:15:00Z",
  },
  {
    id: "seller-002",
    email: "linh.tran@shophub.vn",
    fullName: "Trần Thị Linh",
    phone: "+84 908 234 567",
    subscriptionTier: "Pro",
    roles: ["Operations", "Manager"],
    isActive: true,
    createdAt: "2026-05-05T10:30:00Z",
    lastLoginAt: "2026-05-05T08:45:00Z",
  },
  {
    id: "seller-003",
    email: "khoa.pham@shophub.vn",
    fullName: "Phạm Văn Khoa",
    phone: "+84 907 345 678",
    subscriptionTier: "Pro",
    roles: ["Warehouse", "Staff"],
    isActive: true,
    createdAt: "2026-05-05T14:00:00Z",
    lastLoginAt: "2026-05-04T16:30:00Z",
  },
  {
    id: "seller-004",
    email: "huong.nguyen@shophub.vn",
    fullName: "Nguyễn Thị Hương",
    phone: "+84 906 456 789",
    subscriptionTier: "Pro",
    roles: ["Marketing", "Analyst"],
    isActive: true,
    createdAt: "2026-05-05T09:15:00Z",
    lastLoginAt: "2026-05-05T07:00:00Z",
  },
  {
    id: "seller-005",
    email: "nam.vu@shophub.vn",
    fullName: "Vũ Quý Nam",
    phone: "+84 905 567 890",
    subscriptionTier: "Free",
    roles: ["Viewer"],
    isActive: false,
    createdAt: "2026-05-05T11:45:00Z",
    lastLoginAt: "2026-05-05T13:20:00Z",
  },
];

// Current logged-in user (Operations Lead with highest permissions after Owner)
export const MOCK_CURRENT_USER: User = {
  id: "seller-001",
  email: "minh.nguyen@shophub.vn",
  fullName: "Nguyễn Hoàng Minh",
  phone: "+84 909 123 456",
  subscriptionTier: "Pro",
  roles: ["Owner", "Admin"],
  isActive: true,
  createdAt: "2026-05-05T08:00:00Z",
  lastLoginAt: "2026-05-05T09:15:00Z",
};
