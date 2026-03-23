import { CategoryListData } from "@/api/category/type"
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