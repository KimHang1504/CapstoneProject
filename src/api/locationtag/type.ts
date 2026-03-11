// src/api/locationtag/type.ts

export interface CoupleMoodType {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface CouplePersonalityType {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface LocationTag {
  id: number;
  tagName: string; // ALL CAPS từ BE, FE không dùng để render
  coupleMoodType: CoupleMoodType;
  couplePersonalityType: CouplePersonalityType;
  isActive: boolean;
}

export interface GetLocationTagsResponse {
  message: string;
  code: number;
  data: LocationTag[];
}
