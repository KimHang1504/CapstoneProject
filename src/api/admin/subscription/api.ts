import { apiClient, ApiResponse } from "@/lib/api-client";
import {
  SubscriptionPackage,
  CreateSubscriptionPackageRequest,
  UpdateSubscriptionPackageRequest,
  GetPackagesParams,
} from "./type";

export const getSubscriptionPackages = (params?: GetPackagesParams) => {
  return apiClient.get<ApiResponse<SubscriptionPackage[]>>(
    "/api/admin-subscription-packages",
    { params }
  );
};

export const getSubscriptionPackageById = (id: number) => {
  return apiClient.get<ApiResponse<SubscriptionPackage>>(
    `/api/admin-subscription-packages/${id}`
  );
};

export const createSubscriptionPackage = (data: CreateSubscriptionPackageRequest) => {
  return apiClient.post<ApiResponse<SubscriptionPackage>>(
    "/api/admin-subscription-packages",
    data
  );
};

export const updateSubscriptionPackage = (
  id: number,
  data: UpdateSubscriptionPackageRequest
) => {
  return apiClient.put<ApiResponse<SubscriptionPackage>>(
    `/api/admin-subscription-packages/${id}`,
    data
  );
};

export const deleteSubscriptionPackage = (id: number) => {
  return apiClient.delete<ApiResponse<void>>(
    `/api/admin-subscription-packages/${id}`
  );
};
