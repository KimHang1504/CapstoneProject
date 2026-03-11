import { apiClient, ApiResponse } from "@/lib/api-client";
import { LocationDetail, VenuePagination } from "./type";

export const getAllPendingVenues = () => {
    console.log(apiClient);
    return apiClient.get<ApiResponse<VenuePagination>>("/api/VenueLocation/pending", {
        params: {
            page: 1,
            pageSize: 10,
        }
    });
};

export const getPendingVenueDetail = (id: string) => {
    return apiClient.get<ApiResponse<LocationDetail>>(`/api/VenueLocation/${id}`);
};