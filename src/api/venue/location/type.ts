export type WorkingDays = {
  from: number; // 2 = Thứ 2
  to: number;   // 6 = Thứ 6
};

export type WorkingTime = {
  day: number;       // 2 = Thứ 2 ... 8 = Chủ nhật
  openTime: string;  // "09:00"
  closeTime: string; // "22:00"
  enabled: boolean;
};

export type VenueTag = {
  coupleMoodTypeId: number;
  couplePersonalityTypeId: number;
};


export type VenueLocation = {
  id: number;

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



export type CreateVenueLocationResponse = {
  message: string;
  code: number;
  data: VenueLocation;
  traceId?: string;
  timestamp?: string;
};


export type RegisterVenueLocationRequest = {
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



export type VenueLocationDetail = {
  id: number;
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

  averageRating: number;
  avarageCost: number;
  reviewCount: number;
  favoriteCount: number | null;

  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DRAFTED';

  coverImage?: string[] | null;
  interiorImage?: string[] | null;
  fullPageMenuImage?: string[] | null;

  isOwnerVerified: boolean;

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
  todayOpeningHour: string | null;
  openingHours: any[] | null;
};


export type GetVenueLocationDetailResponse = {
  message: string;
  code: number;
  data: VenueLocationDetail;
};

export type VenueLocationListItem = {
  id: number;

  name: string;
  address: string;

  latitude: number;
  longitude: number;

  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DRAFTED';

  coverImage?: string[] | null;

  isOwnerVerified: boolean;

  venueTags: VenueTag[];

  createdAt: string;
  updatedAt: string;
};

export type GetMyVenueLocationsResponse = {
  message: string;
  code: number;
  data: VenueLocationListItem[];
  traceId?: string;
  timestamp?: string;
};
