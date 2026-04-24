import { apiClient, ApiResponse } from "@/lib/api-client";
import { GetReportTypesResponse, GetVenueReviewsParams, GetVenueReviewsResponse, ReplyReviewResponse, ReviewReply } from "./type";


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

export const getReportTypes = () => {
  return apiClient.get<GetReportTypesResponse>(
    `/api/ReportType`,
    {
      params: {
        page: 1,
        pageSize: 20,
      },
    }
  )
}

export const createReviewReportByOwner = (
  reviewId: number,
  body: {
    reportTypeId: number
    reason: string
  }
) => {
  return apiClient.post<ApiResponse<null>>(
    `/api/Report/venue-owner/reviews/${reviewId}`,
    body
  )
}