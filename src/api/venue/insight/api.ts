import { apiClient, ApiResponse } from '@/lib/api-client';
import { InsightData, Timeframe } from './type';
import { PurchaseSubscriptionResponse } from '@/api/venue/subscription/type';

export const getInsights = (
  timeframe: Timeframe
) => {
  return apiClient.get<ApiResponse<InsightData>>(
    '/api/Insight',
    {
      params: { timeframe }
    }
  );
};

export const getPaymentQrInfo = async (
  transactionId: number
): Promise<ApiResponse<PurchaseSubscriptionResponse>> => {
  return apiClient.get<ApiResponse<PurchaseSubscriptionResponse>>(
    `/api/Payment/qr-info/${transactionId}`
  );
};