import { apiClient } from "@/lib/api-client";
import { GetCoupleMoodTypesResponse, GetCouplePersonalityTypesResponse, GetMoodTypesResponse } from "./type";

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

export const getMoodTypes = () => {
  return apiClient.get<GetMoodTypesResponse>("/api/MoodType");
};