import { GetListUserResponse, GetListUserParams, Users, UpdateUserRequest } from './type';
import { apiClient, ApiResponse } from '@/lib/api-client';

export const getListUsers = async (params: GetListUserParams) => {
  const response = await apiClient.get<ApiResponse<GetListUserResponse>>(
    '/api/Users',
    { params }
  );
  return response.data;
};

export const updateUser = async (id: number, body: UpdateUserRequest) => {
  const response = await apiClient.put<ApiResponse<Users>>(
    `/api/Users/${id}`,
    body
  );
  return response.data;
};

export const getUserById = async (id: number) => {
  const response = await apiClient.get<ApiResponse<Users>>(`/api/Users/${id}`);
  return response.data;
};