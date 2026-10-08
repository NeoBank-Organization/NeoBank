export type UserRole = "CUSTOMER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}