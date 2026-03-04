import { apiClient, ApiResponse } from "@/lib/api-client";
import { GetVenueReviewsParams, GetVenueReviewsResponse, ReplyReviewResponse, ReviewReply } from "./type";


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

export const replyReview = (
  reviewId: number,
  body: { content: string }
) => {
  return apiClient.post<ReplyReviewResponse>(
    `/api/Review/${reviewId}/reply`,
    body
  )
}

export const updateReply = (
  reviewId: number,
  body: { content: string }
) => {
  return apiClient.put<{ data: ReviewReply }>(
    `/api/Review/${reviewId}/reply`,
    body
  )
}

export const deleteReply = (reviewId: number) => {
  return apiClient.delete<ApiResponse<null>>(
    `/api/Review/${reviewId}/reply`
  )
}