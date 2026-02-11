import { apiClient } from "@/lib/api-client";
import { GetVenueReviewsParams, GetVenueReviewsResponse } from "./type";


export const getMyReviews = (params: GetVenueReviewsParams) => {
  return apiClient.get<GetVenueReviewsResponse>(
    `/api/VenueLocation/${params.venueId}/reviews/with-likes`,
    {
      params: {
        date: params.date,
        month: params.month,
        year: params.year,
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 10,
        sortDescending: params.sortDescending ?? true,
      },
    }
  )
}



