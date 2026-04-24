import { ApiResponse } from "@/lib/api-client";

export type GenerateContentRequest = {
  purpose: string;
};

export type GenerateContentResponse = ApiResponse<{
  content: string;
}>;

export type GenerateImageRequest = {
  prompt: string;
};

export type GenerateImageResponse = ApiResponse<{
  imageUrl: string;
}>;

export type VenueReviewImprovementRequest = {
  venueId: number;
  reviewContents: string[];
  prompt: string;
  maxSuggestions?: number;
};

export type VenueReviewImprovementData = {
  summary?: string;
  improvements?: string[];
  recommendations?: string[];
  priorityActions?: string[];
  content?: string;
};

export type VenueReviewImprovementResponse = ApiResponse<VenueReviewImprovementData>;
