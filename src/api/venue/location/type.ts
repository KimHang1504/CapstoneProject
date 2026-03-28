import { LocationTag } from '@/api/locationtag/type';

export type WorkingDays = {
  from: number; // 2 = Monday
  to: number;   // 6 = Friday
};

export type WorkingTime = {
  day: number;       // 2 = Monday ... 8 = Sunday
  openTime: string;  // "09:00"
  closeTime: string; // "22:00"
  enabled: boolean;
};


export type VenueTag = {
  coupleMoodTypeId: number;
  couplePersonalityTypeId: number;
};


export type MyVenueLocation = {
  id: number;

  name: string;
  description: string;
  address: string;

  email: string | null;
  phoneNumber: string;
  websiteUrl: string | null;

  priceMin: number;
  priceMax: number;

  latitude: number;
  longitude: number;

  area: string | null;

  averageRating: number;
  avarageCost: number;
  reviewCount: number;

  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DRAFTED';

  coverImage: string[] | null;
  interiorImage: string[] | null;
  fullPageMenuImage: string[] | null;

  category: string | null;

  isOwnerVerified: boolean;

  createdAt: string;
  updatedAt: string;
  durationDays: number;
  startDate: string;
  endDate: string;


  locationTags: LocationTag[];
};

export type GetMyVenueLocationsResponse = {
  message: string;
  code: number;
  data: MyVenueLocation[];
  traceId?: string;
  timestamp?: string;
};

export type VenueLocationBase = {
  name: string;
  description: string;
  address: string;

  email: string;
  phoneNumber: string;
  websiteUrl?: string;

  priceMin: number;
  priceMax: number;

  latitude: number;
  longitude: number;

  coverImage?: string[];
  interiorImage?: string[];
  fullPageMenuImage?: string[];

  isOwnerVerified: boolean;

  venueTags: VenueTag[];
};


export type VenueLocation = VenueLocationBase & {
  id: number;
};


export type RegisterVenueLocationRequest = VenueLocationBase;
export type UpdateVenueLocationRequest = VenueLocationBase;


export type CreateVenueLocationResponse = {
  message: string;
  code: number;
  data: VenueLocation;
  traceId?: string;
  timestamp?: string;
};

export type UpdateVenueLocationResponse = {
  message: string;
  code: number;
  data: VenueLocation;
  traceId?: string;
  timestamp?: string;
};


export type OpeningHour = {
  day: number;
  openTime: string;
  closeTime: string;
  enabled: boolean;
};

export type TodayOpeningHour = {
  id: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  status: string;
};

export type VenueLocationDetail = VenueLocationBase & {
  id: number;

  averageRating: number;
  avarageCost: number;
  reviewCount: number;
  favoriteCount: number | null;

  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DRAFTED';

  coverImage?: string[] | null;
  interiorImage?: string[] | null;
  fullPageMenuImage?: string[] | null;
  category: string[] | null;
  categories?: { id: number; name: string }[];

  createdAt: string;
  updatedAt: string;

  coupleMoodTypes: {
    id: number;
    name: string;
  }[];

  couplePersonalityTypes: {
    id: number;
    name: string;
  }[];

  venueOwner: {
    id: number;
    businessName: string;
    phoneNumber: string;
    email: string;
    address: string;
    citizenIdFrontUrl: string | null;
    citizenIdBackUrl: string | null;
    businessLicenseUrl: string | null;
  };

  todayDayName: string | null;
  todayOpeningHour: TodayOpeningHour | null;
  openingHours: OpeningHour[] | null;
};

export type GetVenueLocationDetailResponse = {
  message: string;
  code: number;
  data: VenueLocationDetail;
};

// ================= LIST =================

export type VenueLocationListItem = {
  id: number;

  name: string;
  address: string;
  description: string;

  latitude: number;
  longitude: number;

  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DRAFTED';

  coverImage?: string[] | null;

  isOwnerVerified: boolean;

  venueTags: VenueTag[];

  createdAt: string;
  updatedAt: string;
};

export type GetVenueLocationListResponse = {
  message: string;
  code: number;
  data: VenueLocationListItem[];
  traceId?: string;
  timestamp?: string;
};

// ================= PAYMENT =================

export type SubmitVenueWithPaymentRequest = {
  packageId: number;
  quantity: number;
  paymentMethod: 'VIETQR' | 'WALLET';
};

export interface SubmitVenueWithPaymentResponse {
  isSuccess: boolean;
  message: string;
  transactionId: number;
  subscriptionId: number;
  qrCodeUrl: string;
  amount: number;
  paymentContent: string;
  packageName: string;
  totalDays: number;
  expireAt: string;

  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface SubmitVenuePaymentData {
  isSuccess: boolean;
  message: string;
  missingFields: string[];
  transactionId: number;
  subscriptionId: number;
  qrCodeUrl: string;
  amount: number;
  paymentContent: string;
  packageName: string;
  totalDays: number;
  expireAt: string;

  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}
export interface PaymentQrInfoLocation {
  transactionId: number;
  qrCodeUrl: string;
  amount: number;
  paymentContent: string;
  expireAt: string;

  bankInfo: {
    BankName: string;
    AccountNumber: string;
    AccountName: string;
  };
}

export type OpeningHourItem = {
  day: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

export type UpdateOpeningHoursRequest = {
  venueLocationId: number;
  openingHours: OpeningHourItem[];
};

export type UpdateOpeningHoursResponse = {
  message: string;
  code: number;
  data: any;
  traceId?: string;
  timestamp?: string;
};