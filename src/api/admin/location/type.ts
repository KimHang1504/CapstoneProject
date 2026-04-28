// types/venue.ts

export type CoupleMoodType = {
  id: number;
  name: string;
  description: string;
};

export type CouplePersonalityType = {
  id: number;
  name: string;
  description: string;
};

export type Category = {
  id: number;
  name: string;
};

export type VenueOwner = {
  id: number;
  businessName: string;
  phoneNumber: string;
  email: string;
  address: string;
  citizenIdFrontUrl: string | null;
  citizenIdBackUrl: string | null;
  businessLicenseUrl: string | null;
};

export type VenueDetail = {
  id: number;
  name: string;
  description: string;
  address: string;
  email: string;
  phoneNumber: string;
  websiteUrl: string;
  priceMin: number | null;
  priceMax: number | null;
  latitude: number;
  longitude: number;
  averageRating: number;
  avarageCost: number;
  reviewCount: number;
  favoriteCount: number | null;
  status: "ACTIVE" | "PENDING" | "INACTIVE";

  category: string[];
  categories: Category[];

  coverImage: string[];
  interiorImage: string[];
  fullPageMenuImage: string[] | null;

  isOwnerVerified: boolean;

  businessLicenseUrl: string | null;
  rejectionDetails: string | null;

  createdAt: string;
  updatedAt: string;

  coupleMoodTypes: CoupleMoodType[];
  couplePersonalityTypes: CouplePersonalityType[];

  venueOwner: VenueOwner;

  todayDayName: string | null;
  todayOpeningHour: string | null;
  openingHours: any;
  userState: any;
};