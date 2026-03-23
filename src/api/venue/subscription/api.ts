import { apiClient } from "@/lib/api-client";
import { GetSubscriptionPackagesResponse, GetMySubscriptionsResponse } from "./type";

export const getSubscriptionPackages = (type: 'VENUE' | 'MEMBER') => {
  return apiClient.get<GetSubscriptionPackagesResponse>(
    `/api/SubscriptionPackage`,
    { params: { type } }
  );
};

export const getMySubscriptions = () => {
  return apiClient.get<GetMySubscriptionsResponse>(`/api/VenueLocation/my-subscriptions`);
};
