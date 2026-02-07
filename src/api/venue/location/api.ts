import { apiClient } from "@/lib/api-client";
import {
  RegisterVenueLocationRequest,
  CreateVenueLocationResponse,
  GetMyVenueLocationsResponse,
  GetVenueLocationDetailResponse
} from "./type";

export const registerVenueLocation = (
  payload: RegisterVenueLocationRequest
) => {
  return apiClient.post<CreateVenueLocationResponse>(
    "/api/VenueLocation/register",
    payload
  );
};

export const getMyVenueLocations = () => {
  return apiClient.get<GetMyVenueLocationsResponse>(
    "/api/VenueLocation/my-venues"
  );
};

export const getVenueLocationDetail = (id: number) => {
  return apiClient.get<GetVenueLocationDetailResponse>(
    `/api/VenueLocation/${id}`
  );
};