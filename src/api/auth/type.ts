import { access } from "fs";

export interface LoginRequest {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
    businessName: string;
    phoneNumber: string;
    address: string;
}

export interface LoginResponse {
    accessToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;

  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;

  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;

  jti: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}
