import { apiClient } from "@/lib/api-client";
import {
  GenerateContentRequest,
  GenerateContentResponse,
  GenerateImageRequest,
  GenerateImageResponse,
  VenueReviewImprovementRequest,
  VenueReviewImprovementResponse,
} from "./type";

export async function generateAdContent(
  request: GenerateContentRequest
): Promise<GenerateContentResponse> {
  return apiClient.post("/api/AI/generate-ad-content", request);
}

export async function generateAdImage(
  request: GenerateImageRequest
): Promise<GenerateImageResponse> {
  return apiClient.post("/api/AI/generate-ad-image", request);
}

export async function generateVenueReviewImprovements(
  request: VenueReviewImprovementRequest
): Promise<VenueReviewImprovementResponse> {
  return apiClient.post("/api/AI/venue-review-improvements", request);
}
