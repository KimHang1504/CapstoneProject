import { apiClient, ApiResponse } from "@/lib/api-client";
import {
  CreateAdvertisementRequest,
  Advertisement,
  AdvertisementListItem,
  SubmitAdvertisementPaymentResponse,
  SubmitAdvertisementPaymentRequest,
  AdvertisementPackagesResponse,
  UpdateAdvertisementRequest,
} from "./type";
import { PurchaseSubscriptionResponse } from "@/api/venue/subscription/type";

//create
export const createAdvertisement = async (
  data: CreateAdvertisementRequest
): Promise<ApiResponse<Advertisement>> => {
  return apiClient.post<ApiResponse<Advertisement>>(
    "/api/Advertisement/create",
    data
  );
};


//get list
export const getAdvertisements = async (): Promise<
  ApiResponse<AdvertisementListItem[]>
> => {
  return apiClient.get<ApiResponse<AdvertisementListItem[]>>(
    "/api/Advertisement/my-advertisements"
  );
};

//detail
export const getAdvertisementById = async (
  id: number
): Promise<ApiResponse<Advertisement>> => {
  return apiClient.get<ApiResponse<Advertisement>>(
    `/api/Advertisement/${id}`
  );
};

//get gói quảng cáo
export const getAdvertisementPackages = async () => {
  return apiClient.get<ApiResponse<AdvertisementPackagesResponse>>(
    "/api/Advertisement/packages"
  );
};

// submit payment
export const submitAdvertisementPayment = async (
  advertisementId: number,
  data: SubmitAdvertisementPaymentRequest
): Promise<ApiResponse<SubmitAdvertisementPaymentResponse>> => {
  return apiClient.post<
    ApiResponse<SubmitAdvertisementPaymentResponse>
  >(
    `/api/Advertisement/${advertisementId}/submit-with-payment`,
    data
  );
};

export const updateAdvertisementDraft = async (
  id: number,
  data: UpdateAdvertisementRequest
): Promise<ApiResponse<Advertisement>> => {
  return apiClient.put<ApiResponse<Advertisement>>(
    `/api/Advertisement/${id}/update-and-draft`,
    data
  );
};

export const getAdsOrderTransactions = async (
  status?: string
): Promise<ApiResponse<import("./type").AdsOrderTransaction[]>> => {
  return apiClient.get<ApiResponse<import("./type").AdsOrderTransaction[]>>(
    "/api/Advertisement/my-ads-orders",
    { params: status ? { status } : undefined }
  );
};

// Soft delete advertisement
export const softDeleteAdvertisement = async (
  id: number
): Promise<ApiResponse<{ message: string }>> => {
  return apiClient.delete<ApiResponse<{ message: string }>>(
    `/api/Advertisement/${id}/soft-delete`
  );
};

// Restore advertisement
export const restoreAdvertisement = async (
  id: number
): Promise<ApiResponse<Advertisement>> => {
  return apiClient.post<ApiResponse<Advertisement>>(
    `/api/Advertisement/${id}/restore`,
    {}
  );
};

export const getPaymentQrInfo = async (
  transactionId: number
): Promise<ApiResponse<PurchaseSubscriptionResponse>> => {
  return apiClient.get<ApiResponse<PurchaseSubscriptionResponse>>(
    `/api/Payment/qr-info/${transactionId}`
  );
};