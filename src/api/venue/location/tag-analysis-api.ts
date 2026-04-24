import { apiClient } from "@/lib/api-client";
import { GetVenueTagAnalysisResponse } from "./tag-analysis-type";

/**
 * Lấy phân tích độ chính xác của tags cho venue
 * Venue owner chỉ có thể xem phân tích của venue mình
 */
export const getVenueTagAnalysis = (venueId: number) => {
  return apiClient.get<GetVenueTagAnalysisResponse>(
    `/api/venue-owner/tag-analysis/${venueId}`
  );
};

/**
 * Admin xem phân tích tags của bất kỳ venue nào
 */
export const getVenueTagAnalysisAdmin = (venueId: number) => {
  return apiClient.get<GetVenueTagAnalysisResponse>(
    `/api/admin/venue-tag-analysis/${venueId}`
  );
};
