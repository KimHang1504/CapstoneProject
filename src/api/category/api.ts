import { Category, CategoryListData } from "@/api/category/type"
import { apiClient, ApiResponse } from "@/lib/api-client"


export const getCategories = async (
  page = 1,
  pageSize = 300
) => {
  const res = await apiClient.get<ApiResponse<CategoryListData>>(
    "/api/Category",
    {
      params: { page, pageSize }
    }
  )

  return res.data
}

export const createCategory = async (data: {
  name: string
  description: string
  isActive: boolean
}) => {
  const res = await apiClient.post<ApiResponse<Category>>(
    "/api/Category",
    data
  )

  return res.data
}

// Cập nhật category
export const updateCategory = async (
  id: number,
  data: {
    name: string
    description: string
    isActive: boolean
  }
) => {
  const res = await apiClient.put<ApiResponse<Category>>(
    `/api/Category/${id}`,
    data
  )

  return res.data
}

// Xóa category
export const deleteCategory = async (id: number) => {
  const res = await apiClient.delete<ApiResponse<boolean>>(
    `/api/Category/${id}`
  )

  return res.data
}