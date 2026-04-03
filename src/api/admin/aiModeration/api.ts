import { apiClient, ApiResponse } from "@/lib/api-client";
import { ModerationCommentPagination, ModerationPostPagination, ModerationReviewPagination } from "./type";

export const getFlaggedReviews = (page: number, pageSize: number) => {
    return apiClient.get<ApiResponse<ModerationReviewPagination>>(`/api/Review/flagged`, { params: { page, pageSize } });
};

export const ModerateReview = (reviewId: number, action: 'PUBLISH' | 'CANCEL') => {
    return apiClient.post(`/api/Review/${reviewId}/moderation`, { action: action });
};

export const getFlaggedPosts = (page: number, pageSize: number) => {
    return apiClient.get<ApiResponse<ModerationPostPagination>>(`/api/Post/flagged`, { params: { page, pageSize } });
};

export const ModeratePost = (postId: number, action: 'PUBLISH' | 'CANCEL') => {
    return apiClient.post(`/api/Post/${postId}/moderation`, { action: action });
};

export const getFlaggedComments = (page: number, pageSize: number) => {
    return apiClient.get<ApiResponse<ModerationCommentPagination>>(`/api/Comment/flagged`, { params: { page, pageSize } });
};

export const ModerateComment = (commentId: number, action: 'PUBLISH' | 'CANCEL') => {
    return apiClient.post(`/api/Comment/${commentId}/moderation`, { action: action });
};