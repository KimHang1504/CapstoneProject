import { apiClient, ApiResponse } from "@/lib/api-client";

export async function uploadImage(file: File): Promise<string> {
  const res = await apiClient.uploadFile<ApiResponse<string>>(
    "/api/Upload",
    file
  );

  return res.data;
}