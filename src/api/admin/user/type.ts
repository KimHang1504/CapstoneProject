// User roles
export type UserRole = 'STAFF' | 'MEMBER' | 'VENUEOWNER' | 'ADMIN';

// Individual user type
export type Users = {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl: string | null;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  balance: number;
  points: number;
  memberProfile: unknown | null;
  venueOwnerProfile: unknown | null;
};

// Get list users response
export type GetListUserResponse = {
  items: Users[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

// Query parameters for getting users list
export type GetListUserParams = {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
};


export type UpdateUserRequest = {
  fullName: string;
  phoneNumber: string;
  role: UserRole;
  isActive: boolean;
};

