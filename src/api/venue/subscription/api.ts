import { apiClient, ApiResponse } from "@/lib/api-client";
import { GetSubscriptionPackagesResponse, GetMySubscriptionsResponse, PurchaseSubscriptionRequest, PurchaseSubscriptionResponse } from "./type";

export const getSubscriptionPackages = (type: 'VENUE' | 'MEMBER' | 'VENUEOWNER') => {
  return apiClient.get<GetSubscriptionPackagesResponse>(
    `/api/SubscriptionPackage`,
    { params: { type } }
  );
};

export const getMySubscriptions = () => {
  return apiClient.get<GetMySubscriptionsResponse>(`/api/VenueLocation/my-subscriptions`);
};

export const purchaseVenueOwnerSubscription = async (
  data: PurchaseSubscriptionRequest
): Promise<ApiResponse<PurchaseSubscriptionResponse>> => {
  return apiClient.post<ApiResponse<PurchaseSubscriptionResponse>>(
    `/api/VenueLocation/subscription-only/submit-with-payment`,
    data
  );
};
