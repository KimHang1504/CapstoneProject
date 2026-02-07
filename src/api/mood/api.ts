import { apiClient } from "@/lib/api-client";
import { GetCoupleMoodTypesResponse, GetCouplePersonalityTypesResponse } from "./type";

export const getCoupleMoodTypes = () => {
  return apiClient.get<GetCoupleMoodTypesResponse>(
    "/api/VenueLocation/mood-types/all"
  );
};

export const getCouplePersonalityTypes = () => {
  return apiClient.get<GetCouplePersonalityTypesResponse>(
    "/api/VenueLocation/personality-types/all"
  );
};
