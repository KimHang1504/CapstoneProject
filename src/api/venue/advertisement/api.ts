import { apiClient, ApiResponse } from "@/lib/api-client";
import {
  CreateAdvertisementRequest,
  Advertisement,
  AdvertisementListItem,
  SubmitAdvertisementPaymentResponse,
  SubmitAdvertisementPaymentRequest,
  AdvertisementPackagesResponse,
} from "./type";

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

