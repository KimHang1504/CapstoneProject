export interface Category {
    id: number
    name: string
    description: string
    isActive: boolean
}

export type CategoryListData = {
    items: Category[]
    pageNumber: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

