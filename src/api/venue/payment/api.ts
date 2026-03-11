import { PaymentQrInfo } from "@/api/venue/payment/type";
import { apiClient, ApiResponse } from "@/lib/api-client";

export const getPaymentQrInfo = async (
  transactionId: number
): Promise<ApiResponse<PaymentQrInfo>> => {
  return apiClient.get<ApiResponse<PaymentQrInfo>>(
    `/api/Payment/qr-info/${transactionId}`
  );
};

export const cancelPayment = (transactionId: number) => {
  return apiClient.post<ApiResponse<any>>(
    `/api/Payment/cancel/${transactionId}`
  );
};

export const getPaymentStatus = (transactionId: number) => {
  return apiClient.get<ApiResponse<{ status: string }>>(
    `/api/Payment/status/${transactionId}`
  );
};