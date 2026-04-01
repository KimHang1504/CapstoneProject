import { apiClient, ApiResponse } from "@/lib/api-client";
import { ActivateVersionResponse, CreateTestTypeRequest, ImportQuestionsResult, TestQuestion, TestType, TestTypeDetail } from "./type";

export const getAllTestTypes = () => {
  return apiClient.get<ApiResponse<TestType[]>>("/api/TestType");
};

export const createTestType = (body: CreateTestTypeRequest) => {
  return apiClient.post<ApiResponse<TestType>>("/api/TestType", body);
};

export const importQuestionsForTestType = (id: number, file: File) => {
  return apiClient.uploadFile<ApiResponse<ImportQuestionsResult>>(
    `/api/TestType/${id}/question/import`,
    file
  );
};

export const getTestTypeById = (id: number) => {
  return apiClient.get<ApiResponse<TestTypeDetail>>(`/api/TestType/${id}`);
};

export const getQuestionsByTestType = (id: number, version?: number) => {
  return apiClient.get<ApiResponse<TestQuestion[]>>(
    `/api/TestType/${id}/question`,
    {
      params: {
        version,
      },
    }
  );
};

export const activateQuestionVersion = (id: number, version: number) => {
  return apiClient.patch<ApiResponse<ActivateVersionResponse>>(
    `/api/TestType/${id}/activate-version`,
    undefined,
    {
      params: {
        version,
      },
    }
  );
};

export const updateTestType = (id: number, body: CreateTestTypeRequest) => {
  return apiClient.put<ApiResponse<TestType>>(`/api/TestType/${id}`, body);
};