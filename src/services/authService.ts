import apiClient from "./apiClient";

import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from "../features/auth/auth.types";

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    "/api/v1/auth/login",
    credentials
  );

  return response.data;
};

export const refreshToken = async (
  refreshToken: string
): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post<RefreshTokenResponse>(
    "/api/v1/auth/refresh",
    {
      refreshToken,
    }
  );

  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post("/api/v1/auth/logout");
};

