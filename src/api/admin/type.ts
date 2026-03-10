export interface Venue {
  id: number;

  name: string;
  description?: string;

  address?: string;
  email?: string;
  phoneNumber?: string;
  websiteUrl?: string;

  priceMin?: number;
  priceMax?: number;

  latitude?: number;
  longitude?: number;
  area?: string | null;

  averageRating?: number;
  avarageCost?: number;
  reviewCount?: number;

  status: 'REJECTED' | 'APPROVED' | 'PENDING';

  coverImage?: string[];
  interiorImage?: string[];
  fullPageMenuImage?: string[];

  category?: string | null;

  isOwnerVerified?: boolean;
  businessLicenseUrl?: string | null;

  createdAt?: string;
  updatedAt?: string;

  locationTags?: LocationTag[];
}

export interface LocationTag {
  id: number;
  tagName: string;

  detailTag: string[];

  coupleMoodType: CoupleMoodType;
  couplePersonalityType: CouplePersonalityType;
}

export interface CoupleMoodType {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CouplePersonalityType {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface VenuePagination {
  items: Venue[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// LocationDetail 

export interface LocationDetail {
  id: number;
  name: string;
  description: string | null;
  address: string;

  email: string | null;
  phoneNumber: string | null;
  websiteUrl: string | null;

  priceMin: number | null;
  priceMax: number | null;

  latitude: number | null;
  longitude: number | null;

  averageRating: number;
  avarageCost: number | null;
  reviewCount: number;

  favoriteCount: number | null;

  status: string;
  category: string | null;

  coverImage: string[];
  interiorImage: string[];
  fullPageMenuImage: string[];

  isOwnerVerified: boolean;

  businessLicenseUrl: string | null;

  createdAt: string;
  updatedAt: string;

  coupleMoodTypes: CoupleMoodType[];
  couplePersonalityTypes: CouplePersonalityType[];

  venueOwner: VenueOwner | null;

  todayDayName: string | null;
  todayOpeningHour: OpeningHour | null;

  openingHours: OpeningHour[] | null;

  userState: string | null;
}

export interface CoupleMoodType {
  id: number;
  name: string;
}

export interface CouplePersonalityType {
  id: number;
  name: string;
}

export interface VenueOwner {
  id: number;
  businessName: string;
  phoneNumber: string | null;
  email: string | null;
  address: string | null;

  citizenIdFrontUrl: string | null;
  citizenIdBackUrl: string | null;
  businessLicenseUrl: string | null;
}

export interface OpeningHour {
  dayName: string;
  openTime: string;
  closeTime: string;
}