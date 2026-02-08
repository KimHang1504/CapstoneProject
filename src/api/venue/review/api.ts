import { apiClient } from "@/lib/api-client";
import { GetVenueReviewsParams, GetVenueReviewsResponse } from "./type";


export const getMyReviews = (params: GetVenueReviewsParams) => {
  return apiClient.get<GetVenueReviewsResponse>(
    `/api/VenueLocation/${params.venueId}/reviews`,
    {
      params: {
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 10,
      },
    }
  )
}



