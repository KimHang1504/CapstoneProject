export interface GetVenueReviewsResponse {
  message: string
  code: number
  data: {
    summary: ReviewSummary
    reviews: PaginatedReviews
  }
  traceId: string
  timestamp: string
}

export interface ReviewSummary {
  averageRating: number
  totalReviews: number
  ratings: RatingDistribution[]
  moodMatchPercentage: number
  matchedReviewsCount: number
}

export interface RatingDistribution {
  star: number 
  count: number
  percent: number
}

export interface PaginatedReviews {
  items: Review[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface Review {
  id: number
  venueId: number
  rating: number
  content: string
  visitedAt: string
  isAnonymous: boolean
  likeCount: number
  status: string
  createdAt: string
  updatedAt: string

  member: Member

  imageUrls: string[] | null

  matchedTag: string | null

  reviewLikes: ReviewLike[]

  reviewReply: ReviewReply | null
}
export interface Member {
  id: number
  userId: number
  fullName: string
  gender: string
  bio: string
  displayName: string
  avatarUrl: string
  email: string
}

export interface ReviewReply {
  id: number
  content: string
  createdAt: string
  updatedAt: string
}

export interface ReviewLike {
  id: number
  memberId: number
  createdAt: string
  member: Member
}


export interface GetVenueReviewsParams {
  venueId: number

  date?: string
  month?: number
  year?: number

  page?: number
  pageSize?: number
  sortDescending?: boolean
}

