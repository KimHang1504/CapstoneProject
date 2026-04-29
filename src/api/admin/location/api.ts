import { VenueDetail } from "@/api/admin/location/type";
import { apiClient, ApiResponse } from "@/lib/api-client";


export const getVenueDetail = (id: number) => {
  return apiClient.get<ApiResponse<VenueDetail>>(
    `/api/VenueLocation/${id}`
  );
};