import { apiClient, ApiResponse } from "@/lib/api-client";
import { CreateVoucherRequest, Pagination, ValidateVoucherItemData, Voucher, VoucherDetail, VoucherExchangeItem, VoucherItemListResponse, VoucherListResponse, VoucherRedemptionListResponse, VoucherStatus, VoucherSummary } from "./type";

//tạo mới voucher
export const createVoucher = (data: CreateVoucherRequest) => {
  return apiClient.post<ApiResponse<Voucher>>(
    "/api/venue-vouchers",
    data
  );
};

export const updateVoucher = (id: number, data: CreateVoucherRequest) => {
  return apiClient.put(`/api/venue-vouchers/${id}`, data);
};

//lấy danh sách voucher
type GetVoucherParams = {
  pageNumber?: number;
  pageSize?: number;
  status?: VoucherStatus;
  keyword?: string;
  sortBy?: "createdAt" | "updatedAt";
  orderBy?: "asc" | "desc";
};

export const getMyVouchers = (params?: GetVoucherParams) => {
  return apiClient.get<ApiResponse<VoucherListResponse>>(
    "/api/venue-vouchers",
    { params }
  );
};

//get detail
export const getVoucherDetail = (voucherId: number) => {
  return apiClient.get<ApiResponse<VoucherDetail>>(
    `/api/venue-vouchers/${voucherId}`
  );
};

export const deleteVoucher = (voucherId: number) => {
  return apiClient.delete<ApiResponse<null>>(
    `/api/venue-vouchers/${voucherId}`
  );
};

export const submitVoucher = (voucherId: number) => {
  return apiClient.post<ApiResponse<null>>(
    `/api/venue-vouchers/${voucherId}/submit`
  );
};

export const revokeVoucher = (voucherId: number) => {
  return apiClient.post<ApiResponse<null>>(
    `/api/venue-vouchers/${voucherId}/revoke`
  );
};

export const activateVoucher = (voucherId: number) => {
  return apiClient.post<ApiResponse<null>>(
    `/api/venue-vouchers/${voucherId}/activate`
  );
};

export const endVoucher = (voucherId: number) => {
  return apiClient.post<ApiResponse<null>>(
    `/api/venue-vouchers/${voucherId}/end`
  );
};

//voucher item
type GetVoucherItemsParams = {
  voucherId: number;

  pageNumber?: number;
  pageSize?: number;

  status?: string;
  code?: string;

  sortBy?: "createdAt" | "updatedAt";
  orderBy?: "asc" | "desc";
};

export const getVoucherItems = (params: GetVoucherItemsParams) => {
  const { voucherId, ...query } = params;

  return apiClient.get<ApiResponse<VoucherItemListResponse>>(
    `/api/venue-vouchers/${voucherId}/items`,
    {
      params: query,
    }
  );
};

//flow redeem voucher

export type VoucherRedeemPayload = {
  itemCode: string;
  venueLocationId: number;
};

// validate voucher item
export const validateVoucherItem = (payload: VoucherRedeemPayload) => {
  return apiClient.post<ApiResponse<ValidateVoucherItemData>>(
    "/api/venue-vouchers/voucher-items/validate",
    payload
  );
};

// redeem voucher item
export const redeemVoucherItem = (payload: VoucherRedeemPayload) => {
  return apiClient.post<ApiResponse<null>>(
    "/api/venue-vouchers/voucher-items/redeem",
    payload
  );
};

export const getVoucherSummary = (voucherId: number) => {
  return apiClient.get<ApiResponse<VoucherSummary>>(
    `/api/venue-vouchers/${voucherId}/summary`
  );
};

type GetVoucherExchangesParams = {
  voucherId: number;

  pageNumber?: number;
  pageSize?: number;

  keyword?: string;

  fromDate?: string;
  toDate?: string;

  orderBy?: "asc" | "desc";
};

export const getVoucherExchanges = (
  params: GetVoucherExchangesParams
) => {
  const { voucherId, ...query } = params;

  return apiClient.get<ApiResponse<Pagination<VoucherExchangeItem>>>(
    `/api/venue-vouchers/${voucherId}/exchanges`,
    {
      params: query,
    }
  );
};


type GetVoucherRedemptionsParams = {
  voucherId: number;

  pageNumber?: number;
  pageSize?: number;

  keyword?: string;

  fromDate?: string;
  toDate?: string;

  orderBy?: "asc" | "desc";
};

export const getVoucherRedemptions = (
  params: GetVoucherRedemptionsParams
) => {
  const { voucherId, ...query } = params;

  return apiClient.get<ApiResponse<VoucherRedemptionListResponse>>(
    `/api/venue-vouchers/${voucherId}/redemptions`,
    {
      params: query,
    }
  );
};