import { apiClient, ApiResponse } from '@/lib/api-client';
import { InsightData, Timeframe } from './type';

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