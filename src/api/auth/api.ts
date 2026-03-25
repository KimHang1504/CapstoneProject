import { apiClient, ApiResponse } from "@/lib/api-client";
import {
  GoogleLoginRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserProfile,
} from "./type";

export const login = (payload: LoginRequest) => {
  return apiClient.post<ApiResponse<LoginResponse>>(
    "/api/Auth/login",
    payload
  );
};

export const loginWithGoogle = (payload: GoogleLoginRequest) => {
  return apiClient.post<ApiResponse<LoginResponse>>(
    "/api/Auth/google-login",
    payload
  );
};

export const register = (payload: RegisterRequest) => {
  return apiClient.post<ApiResponse<null>>(
    "/api/Auth/register-venue-owner",
    payload
  );
};

export const getMe = () => {
  return apiClient.get<ApiResponse<UserProfile>>("/api/Auth/me");
};