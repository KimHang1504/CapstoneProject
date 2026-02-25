import { apiClient } from "@/lib/api-client";
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
  MyVenueLocation
} from "./type";
import { ApiResponse } from "@/api/mood/type";

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

export const submitVenueWithPayment = (id: number, payload: SubmitVenueWithPaymentRequest) => {
  return apiClient.post<SubmitVenueWithPaymentResponse>(
    `/api/VenueLocation/${id}/submit-with-payment`,
    payload
  );
};

export const updateOpeningHours = (payload: UpdateOpeningHoursRequest) => {
  return apiClient.post<UpdateOpeningHoursResponse>(
    `/api/VenueLocation/opening-hours/update`,
    payload
  );
};


export const cancelPayment = (transactionId: number) => {
  return apiClient.post<ApiResponse<any>>(
    `/api/Payment/cancel/${transactionId}`
  );
};

export const getPaymentStatus = (transactionId: number) => {
  return apiClient.get<ApiResponse<{ status: string }>>(
    `/api/Payment/status/${transactionId}`
  );
};
