import { ApiResponse } from "@/lib/api-client";

// 1 item mood
export type CoupleMoodType = {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
};



export type CouplePersonalityType = {
  id: number;
  name: string;
  description: string;
};

export type MoodType = {
  id: number;
  name: string;
  iconUrl: string;
  isActive: boolean;
  createdAt: string;
};


// response riêng cho mood types
export type GetCoupleMoodTypesResponse = ApiResponse<CoupleMoodType[]>;
export type GetCouplePersonalityTypesResponse = ApiResponse<CouplePersonalityType[]>;
export type GetMoodTypesResponse = ApiResponse<MoodType[]>;

