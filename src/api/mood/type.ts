// 1 item mood
export type CoupleMoodType = {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
};

// response chung của BE
export type ApiResponse<T> = {
  message: string;
  code: number;
  data: T;
  traceId: string;
  timestamp: string;
};

export type CouplePersonalityType = {
  id: number;
  name: string;
};



// response riêng cho mood types
export type GetCoupleMoodTypesResponse = ApiResponse<CoupleMoodType[]>;
export type GetCouplePersonalityTypesResponse = ApiResponse<CouplePersonalityType[]>;
