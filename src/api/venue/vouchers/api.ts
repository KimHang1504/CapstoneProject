import { apiClient, ApiResponse } from "@/lib/api-client";
import { CreateVoucherRequest, Voucher } from "./type";

export const createVoucher = (data: CreateVoucherRequest) => {
  return apiClient.post<ApiResponse<Voucher>>(
    "/api/venue-vouchers",
    data
  );
};