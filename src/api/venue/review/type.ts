export enum ReviewStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

export interface ReviewMember {
  id: number
  userId: number
  fullName: string
  displayName: string
  gender: Gender
  bio: string | null
  avatarUrl: string | null
  email: string
}


export interface ReviewItem {
  id: number
  venueId: number
  rating: number
  content: string
  visitedAt: string
  isAnonymous: boolean
  likeCount: number
  status: ReviewStatus
  createdAt: string
  updatedAt: string
  member: ReviewMember | null
  imageUrls: string[] | null
  matchedTag: string
}


export interface PaginatedReviews {
  items: ReviewItem[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}


export interface RatingDistribution {
  star: number
  count: number
  percent: number
}

export interface ReviewSummary {
  averageRating: number
  totalReviews: number
  ratings: RatingDistribution[]
}

export interface VenueReviewsData {
  summary: ReviewSummary
  reviews: PaginatedReviews
}

export type GetVenueReviewsParams = {
  venueId: number
  page?: number
  pageSize?: number
}

export type GetVenueReviewsResponse = {
  message: string
  code: number
  data: VenueReviewsData
  traceId?: string
  timestamp?: string
}
