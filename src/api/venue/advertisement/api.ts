import { apiClient, ApiResponse } from "@/lib/api-client";
import {
  CreateAdvertisementRequest,
  Advertisement,
  AdvertisementListItem,
  AdvertisementPackage,
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
  return apiClient.get<ApiResponse<AdvertisementPackage[]>>(
    "/api/Advertisement/packages"
  );
};