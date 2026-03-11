import { apiClient, ApiResponse } from "@/lib/api-client";
import {
  RegisterVenueLocationRequest,
  CreateVenueLocationResponse,
  GetVenueLocationDetailResponse,
  UpdateVenueLocationRequest,
  UpdateVenueLocationResponse,
  SubmitVenueWithPaymentRequest,
  SubmitVenueWithPaymentResponse,
  UpdateOpeningHoursRequest,
  UpdateOpeningHoursResponse,
  MyVenueLocation,
  PaymentQrInfoLocation
} from "./type";


export const registerVenueLocation = (
  payload: RegisterVenueLocationRequest
) => {
  return apiClient.post<CreateVenueLocationResponse>(
    "/api/VenueLocation/register",
    payload
  );
};

export const getMyVenueLocations = async () => {
  const res = await apiClient.get<ApiResponse<MyVenueLocation[]>>(
    "/api/VenueLocation/my-venues"
  );

  return res.data;
};

export const getVenueLocationDetail = (id: number) => {
  return apiClient.get<GetVenueLocationDetailResponse>(
    `/api/VenueLocation/${id}`
  );
};

export const updateVenueLocation = (id: number, payload: UpdateVenueLocationRequest) => {
  return apiClient.put<UpdateVenueLocationResponse>(
    `/api/VenueLocation/${id}`,
    payload
  );
};

export const submitVenueWithPayment = async (
  locationId: number,
  data: SubmitVenueWithPaymentRequest
): Promise<ApiResponse<SubmitVenueWithPaymentResponse>> => {
  return apiClient.post<ApiResponse<SubmitVenueWithPaymentResponse>>(
    `/api/VenueLocation/${locationId}/submit-with-payment`,
    data
  );
};

export const getPaymentQrInfo = async (
  transactionId: number
): Promise<ApiResponse<PaymentQrInfoLocation>> => {
  return apiClient.get<ApiResponse<PaymentQrInfoLocation>>(
    `/api/Payment/qr-info/${transactionId}`
  );
};

export const updateOpeningHours = (payload: UpdateOpeningHoursRequest) => {
  return apiClient.post<UpdateOpeningHoursResponse>(
    `/api/VenueLocation/opening-hours/update`,
    payload
  );
};



