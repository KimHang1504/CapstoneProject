import { apiClient, ApiResponse } from "@/lib/api-client";
import { Advertisement, AdvertisementAcceptRequest, AdvertisementRejectRequest, Challenge, ChallengeConfigResponse, ChallengePagination, ChallengeRequest, CreateSpecialEventRequest, LocationDetail, LocationPagination, LocationRequest, Recommendations, SpecialEvent, SpecialEventPagination, VenueApprovalRequest, VenuePagination, Voucher, VoucherPagination, VoucherSearchRequest } from "./type";

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

export const createSpecialEvent = (body: CreateSpecialEventRequest) => {
    return apiClient.post<ApiResponse<void>>("/api/SpecialEvent", body);
};

// Challenge
export const getAllChallenges = (page: number, pageSize: number) => {
    return apiClient.get<ApiResponse<ChallengePagination>>("/api/Challenge", {
        params: {
            page,
            pageSize,
        }
    });
}

export const getChallengeDetail = (id: string) => {
    console.log("Getting challenge detail for id:", id);
    console.log("API URL:", apiClient);
    return apiClient.get<ApiResponse<Challenge>>(`/api/Challenge/${id}`);
}

export const getLocations = (body: LocationRequest) => {
    return apiClient.post<ApiResponse<Recommendations>>("/api/venue-location/search", body);
}

export const createChallenge = (body: ChallengeRequest) => {
    return apiClient.post<ApiResponse<Challenge>>("/api/Challenge", body);
}

export const deleteChallenge = (challengeId: number) => {
    return apiClient.delete(`/api/Challenge`,
        {
            params: { challengeId }
        }
    );
}

export const getChallengeConfig = () => {
    return apiClient.get<ApiResponse<ChallengeConfigResponse>>("/api/Challenge/definitions");
}

//Advertisement management
export const getPendingAdvertisements = () =>{
    return apiClient.get<ApiResponse<Advertisement[]>>("/api/Advertisement/pending");
}

export const acceptPendingAdvertisements = (body: AdvertisementAcceptRequest) =>{
    return apiClient.post<ApiResponse<void>>("/api/Advertisement/approve", body);
}

export const rejectPendingAdvertisements = (body: AdvertisementRejectRequest) =>{
    return apiClient.post<ApiResponse<void>>("/api/Advertisement/reject", body);
}

//Voucher management
export const getVouchers = (request: VoucherSearchRequest) => {
    return apiClient.get<ApiResponse<VoucherPagination>>("/api/admin-vouchers/pending", {
        params: {
            PageNumber: request.PageNumber,
            PageSize: request.PageSize,
            Status: request.Status,
            Keyword: request.Keyword,
            VenueOwnerId: request.VenueOwnerId,
            SortBy: request.SortBy,
            SortDirection: request.SortDirection

        }
    });
}

export const getAllVouchers = (request: VoucherSearchRequest) => {
    return apiClient.get<ApiResponse<VoucherPagination>>("/api/admin-vouchers", {
        params: {
            PageNumber: request.PageNumber,
            PageSize: request.PageSize,
            Status: request.Status,
            Keyword: request.Keyword,
            VenueOwnerId: request.VenueOwnerId,
            SortBy: request.SortBy,
            SortDirection: request.SortDirection

        }
    });
}

export const getVoucherDetail = (id: number) => {
    return apiClient.get<ApiResponse<Voucher>>(`/api/admin-vouchers/${id}`);
}

export const approveVoucher = (id: number) => {
    return apiClient.post(`/api/admin-vouchers/${id}/approve`);
}

export const rejectVoucher = (id: number, rejectReason: string) => {
    return apiClient.post(`/api/admin-vouchers/${id}/reject`, { rejectReason });
}