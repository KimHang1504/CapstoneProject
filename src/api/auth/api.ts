import { apiClient, ApiResponse } from "@/lib/api-client";
import { LoginRequest, LoginResponse } from "./type";

export const login = (payload: LoginRequest) => {
  return apiClient.post<ApiResponse<LoginResponse>>(
    "/api/Auth/login",
    payload
  );
};