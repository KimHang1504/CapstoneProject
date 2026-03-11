import { apiClient, ApiResponse } from "@/lib/api-client";
import { LocationDetail, SpecialEvent, SpecialEventPagination, VenueApprovalRequest, VenuePagination } from "./type";

export const getAllPendingVenues = (page: number, pageSize: number) => {
    console.log(apiClient);
    return apiClient.get<ApiResponse<VenuePagination>>("/api/VenueLocation/pending", {
        params: {
            page,
            pageSize,
        }
    });
};

export const getPendingVenueDetail = (id: string) => {
    return apiClient.get<ApiResponse<LocationDetail>>(`/api/VenueLocation/${id}`);
};

export const acceptAndRejectVenue = (body: VenueApprovalRequest) => {
    return apiClient.post(`/api/VenueLocation/approve`, body);
}

// Special Event
export const getAllSpecialEvents = (page: number, pageSize: number) => {
    return apiClient.get<ApiResponse<SpecialEventPagination>>("/api/SpecialEvent", {
        params: {
            page,
            pageSize,
        }
    });
};

export const getSpecialEventDetail = (id: string) => {
    return apiClient.get<ApiResponse<SpecialEvent>>(`/api/SpecialEvent/${id}`);
};

export const deleteSpecialEvent = (id: number) => {
    return apiClient.delete(`/api/SpecialEvent/${id}`);
}