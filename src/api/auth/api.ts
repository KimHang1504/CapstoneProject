import { apiClient, ApiResponse } from "@/lib/api-client";
import {
  GoogleLoginRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UpdatePasswordRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
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

export const updatePassword = (payload: UpdatePasswordRequest) => {
  return apiClient.post<ApiResponse<null>>(
    "/api/Auth/update-password",
    payload
  );
};

export const forgotPassword = (payload: ForgotPasswordRequest) => {
  return apiClient.post<ApiResponse<null>>(
    "/api/Auth/forgot-password",
    payload
  );
};

export const verifyOtp = (payload: VerifyOtpRequest) => {
  return apiClient.post<ApiResponse<null>>(
    "/api/Auth/verify-otp",
    payload
  );
};

export const resetPassword = (payload: ResetPasswordRequest) => {
  return apiClient.post<ApiResponse<null>>(
    "/api/Auth/reset-password",
    payload
  );
};