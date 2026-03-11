import { apiClient } from "@/lib/api-client";
import { GetLocationTagsResponse } from "./type";

export const getLocationTags = () => {
  return apiClient.get<GetLocationTagsResponse>(
    "/api/LocationTag/all"
  );
};
