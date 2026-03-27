import {
  GetSettlementListParams,
  SettlementDetail,
  SettlementDetailResponse,
  SettlementListData,
  SettlementListResponse,
  SettlementSummary,
} from "@/api/venue/settlement/type";
import { apiClient, ApiResponse } from "@/lib/api-client";

// Lấy tổng quan đối soát
export const getSettlementSummary = async () => {
  const res = await apiClient.get<ApiResponse<SettlementSummary>>(
    "/api/VenueSettlement/summary"
  );

  return res.data;
};

// Lấy danh sách đối soát
export const getSettlementList = async (
  params?: GetSettlementListParams
): Promise<SettlementListData> => {
  const res = await apiClient.get<SettlementListResponse>(
    "/api/VenueSettlement",
    {
      params: {
        PageNumber: params?.PageNumber ?? 1,
        PageSize: params?.PageSize ?? 10,
        Status: params?.Status,
        FromDate: params?.FromDate,
        ToDate: params?.ToDate,
        SortBy: params?.SortBy ?? "createdAt",
        OrderBy: params?.OrderBy ?? "desc",
      },
    }
  );

  return res.data;
};

export const getSettlementDetail = async (
  settlementId: number
): Promise<SettlementDetail> => {
  const res = await apiClient.get<SettlementDetailResponse>(
    `/api/VenueSettlement/${settlementId}`
  );

  return res.data;
};