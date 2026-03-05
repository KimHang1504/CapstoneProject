import { apiClient } from "@/lib/api-client";
import { GetSubscriptionPackagesResponse } from "./type";

export const getSubscriptionPackages = (type: 'VENUE' | 'MEMBER') => {
  return apiClient.get<GetSubscriptionPackagesResponse>(
    `/api/SubscriptionPackage`,
    { params: { type } }
  );
};
