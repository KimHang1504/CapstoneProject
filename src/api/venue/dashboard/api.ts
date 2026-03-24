// /api/venue/dashboard/api.ts

import { apiClient, ApiResponse } from "@/lib/api-client";
import { VenueOwnerDashboardOverview } from "./type";

export const getVenueOwnerDashboardOverview = async () => {
  return apiClient.get<ApiResponse<VenueOwnerDashboardOverview>>(
    "/api/venue-owner/dashboard/overview"
  );
};