export interface LoginRequest {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
    businessName: string;
    phoneNumber: string;
    address: string;
}

export interface UpdatePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface VerifyOtpRequest {
    email: string;
    otpCode: string;
}

export interface ResetPasswordRequest {
    email: string;
    otpCode: string;
    newPassword: string;
    confirmPassword: string;
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
  assigned_venue_location_id: number | null;
}

export interface VenueOwnerProfile {
  id: number;
  businessName: string;
  phoneNumber: string;
  email: string;
  address: string;
  citizenIdFrontUrl: string;
  citizenIdBackUrl: string;
  businessLicenseUrl: string | null;
}

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  memberProfile: null;
  venueOwnerProfile: VenueOwnerProfile | null;
}
