import { apiClient } from "@/lib/api-client";
import {
  GenerateContentRequest,
  GenerateContentResponse,
  GenerateImageRequest,
  GenerateImageResponse,
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
