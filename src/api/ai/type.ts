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
