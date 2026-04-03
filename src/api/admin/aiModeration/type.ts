//Review
export interface ModerationReview {
    id: number;
    content: string;
    rating: number;
    imageUrls: string[];

    status: 'FLAGGED';
    aiConfidence?: number;
    flaggedReason?: string;

    createdAt: string;

    member: {
        id: number;
        displayName: string;
        avatarUrl: string;
        violationCount?: number;
    };

    venue?: {
        venueName: string;
    };
}

export interface ModerationReviewPagination {
    items: ModerationReview[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

//Post
export interface ModerationPost {
    id: number;
    content: string;

    mediaPayload: {
        url: string;
        type: 'IMAGE' | 'VIDEO';
    }[];

    createdAt: string;

    author: {
        id: number;
        fullName: string;
        avatar: string;
        violationCount?: number;
    };

    locationName?: string;

}

export interface ModerationPostPagination {
    items: ModerationPost[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

// Comment
export interface ModerationComment {
  id: number;
  content: string;

  createdAt: string;
  level: number;

  author: {
    id: number;
    fullName: string;
    avatar: string;
    violationCount?: number;
  };

  replyToMember?: {
    id: number;
    fullName: string;
  };

}

export interface ModerationCommentPagination {
  items: ModerationComment[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}