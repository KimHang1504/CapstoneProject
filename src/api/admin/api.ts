import { apiClient, ApiResponse } from "@/lib/api-client";
import { Advertisement, AdvertisementAcceptRequest, AdvertisementDetail, AdvertisementRejectRequest, Challenge, ChallengeConfigResponse, ChallengePagination, ChallengeRequest, CommissionRevenueResponse, ConfigPagination, CreateReportTypeRequest, CreateSpecialEventRequest, DashboardRequest, DashboardStats, LocationDetail, LocationPagination, LocationRequest, Recommendations, Report, ReportPagination, ReportType, ReportTypePagination, SpecialEvent, SpecialEventPagination, TransactionPagination, TransactionType, TransactionTypeToInt, UpdateConfigRequest, Venue, VenueApprovalRequest, VenueDetail, VenuePagination, Voucher, VoucherPagination, VoucherSearchRequest, WithdrawRequest, WithdrawRequestPagination } from "./type";

//Dashboard
export const getDashboardStats = (request: DashboardRequest) => {
    return apiClient.get<ApiResponse<DashboardStats>>("/api/Admin/dashboard", {
        params: {
            Year: request.Year,
            Month: request.Month,
        }
    });
}

//Venue management
export const getAllPendingVenues = (
    page: number,
    pageSize: number,
    status?: string,
    search?: string
) => {
    return apiClient.get<ApiResponse<VenuePagination>>("/api/VenueLocation/my-venues/by-status", {
        params: {
            page,
            pageSize,
            status: status || undefined,
            search: search || undefined,
        }
    });
};

export const getPendingVenueDetail = (id: number) => {
    return apiClient.get<ApiResponse<VenueDetail>>(`/api/VenueLocation/${id}/docs`);
};

export const acceptAndRejectVenue = (body: VenueApprovalRequest) => {
    return apiClient.post(`/api/VenueLocation/approve`, body);
}

export const updateVenueStatusToInactive = (venueId: number, reason: string | null) => {
    return apiClient.patch(`/api/Admin/venues/${venueId}/status`, {
        status: 'INACTIVE',
        reason: reason
    });
}

export const clearVenueLocationSearchIndex = () => {
    return apiClient.delete<ApiResponse<boolean>>('/api/venue-location/search/index/clear');
}

export const clearVenueLocationSearchIndexV2 = () => {
    return apiClient.delete<ApiResponse<boolean>>('/api/venue-location/v2/search/index/clear');
}

export const syncVenueLocationSearchIndex = () => {
    return apiClient.post<ApiResponse<number>>('/api/venue-location/search/sync');
}

export const syncVenueLocationSearchIndexV2 = () => {
    return apiClient.post<ApiResponse<number>>('/api/venue-location/v2/search/sync');
}

export const refreshVenueLocationSearchIndexes = async () => {
    await Promise.all([
        clearVenueLocationSearchIndex(),
        clearVenueLocationSearchIndexV2(),
    ]);

    await Promise.all([
        syncVenueLocationSearchIndex(),
        syncVenueLocationSearchIndexV2(),
    ]);
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

export const updateSpecialEvent = (id: number, body: CreateSpecialEventRequest) => {
    return apiClient.patch<ApiResponse<void>>(`/api/SpecialEvent/${id}`, body);
}

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

export const updateStatusChallenge = (challengeId: number, newStatus: string) => {
    return apiClient.patch(`/api/Challenge/${challengeId}/status`, null, {
        params: { newStatus }
    });
}

export const updateChallenge = (challengeId: number, body: ChallengeRequest) => {
    return apiClient.put(`/api/Challenge/${challengeId}`, body);
}

//Advertisement management
export const getPendingAdvertisements = () => {
    return apiClient.get<ApiResponse<Advertisement[]>>("/api/Advertisement/pending");
}

export const getAdvertisementDetail = (id: number) => {
    return apiClient.get<ApiResponse<AdvertisementDetail>>(`/api/Advertisement/${id}`);
}

export const acceptPendingAdvertisements = (body: AdvertisementAcceptRequest) => {
    return apiClient.post<ApiResponse<void>>("/api/Advertisement/approve", body);
}

export const rejectPendingAdvertisements = (body: AdvertisementRejectRequest) => {
    return apiClient.post<ApiResponse<void>>("/api/Advertisement/reject", body);
}

export const getAllAdvertisements = (status?: string) => {
    return apiClient.get<ApiResponse<Advertisement[]>>("/api/Advertisement/all", {
        params: {
            status: status || undefined
        }
    });
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

export const getAdminVoucherCommissionRevenue = (
    fromDate: string,
    toDate: string,
    groupBy: 'day' | 'month' | 'year'
) => {
    return apiClient.get<ApiResponse<CommissionRevenueResponse>>(
        `/api/admin-vouchers/commission-revenue`,
        { params: { FromDate: fromDate, ToDate: toDate, GroupBy: groupBy } }
    );
}

//Report management
export const getReports = (
    PageNumber: number,
    PageSize: number,
    TargetType?: string,
    Status?: string
) => {
    return apiClient.get<ApiResponse<ReportPagination>>("/api/Report", {
        params: {
            PageNumber,
            PageSize,
            TargetType: TargetType || undefined,
            Status: Status || undefined,
        },
    });
};

export const getReportDetail = (id: number) => {
    return apiClient.get<ApiResponse<Report>>(`/api/Report/${id}`);
};

export const approveReport = (id: number) => {
    return apiClient.put<ApiResponse<void>>(`/api/Report/${id}/approve`);
}

export const rejectReport = (id: number) => {
    return apiClient.put<ApiResponse<void>>(`/api/Report/${id}/reject`);
}

export const getReportTypes = (page: number, pageSize: number) => {
    return apiClient.get<ApiResponse<ReportTypePagination>>("/api/ReportType", {
        params: {
            page,
            pageSize
        }
    });
}

export const getReportTypeDetail = (id: number) => {
    return apiClient.get<ApiResponse<ReportType>>(`/api/ReportType/${id}`);
}

export const createReportType = (body: CreateReportTypeRequest) => {
    return apiClient.post<ApiResponse<void>>("/api/ReportType", body);
};

export const deleteReportType = (id: number) => {
    return apiClient.delete(`/api/ReportType/${id}`);
}

export const updateReportType = (id: number, body: CreateReportTypeRequest) => {
    return apiClient.put(`/api/ReportType/${id}`, body);
}

//Config management
export const getConfigs = (pageNumber: number, pageSize: number) => {
    return apiClient.get<ApiResponse<ConfigPagination>>("/api/SystemConfig", {
        params: {
            pageNumber,
            pageSize,
        }
    });
}

export const updateConfig = (body: UpdateConfigRequest) => {
    return apiClient.put(`/api/SystemConfig`, body);
}

//Withdraw management
export const getWithdrawRequests = (status: string, pageNumber?: number, pageSize?: number) => {
    return apiClient.get<ApiResponse<WithdrawRequestPagination>>("/api/withdraw-requests", {
        params: {
            status: status || undefined,
            pageNumber,
            pageSize
        }
    });
}

export const approveWithdrawRequest = (withdrawRequestId: number) => {
    return apiClient.post<ApiResponse<WithdrawRequest>>(`/api/withdraw-requests/${withdrawRequestId}/approve`);
}

export const rejectWithdrawRequest = (withdrawRequestId: number, reason: string) => {
    return apiClient.post<ApiResponse<WithdrawRequest>>(`/api/withdraw-requests/${withdrawRequestId}/reject`, { reason });
}

export const completeWithdrawRequest = (withdrawRequestId: number, proofImageUrl: string) => {
    return apiClient.put<ApiResponse<WithdrawRequest>>(`/api/withdraw-requests/${withdrawRequestId}/complete`, {
        status: "COMPLETED",
        proofImageUrl
    });
}

//Transaction management
export const getTransactions = (
    pageNumber: number,
    pageSize: number,
    status?: string,
    transType?: TransactionType,
    userId?: number
) => {
    return apiClient.get<ApiResponse<TransactionPagination>>(
        "/api/Admin/transactions",
        {
            params: {
                pageNumber,
                pageSize,
                status: status || undefined,
                transType: transType
                    ? TransactionTypeToInt[transType]
                    : undefined,
                userId: userId || undefined,
            },
        }
    );
};