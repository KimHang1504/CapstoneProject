export type DiscountType =
  | "FIXED_AMOUNT"
  | "PERCENTAGE";

export type CreateVoucherRequest = {
  title: string;
  description?: string;

  voucherPrice: number | null;

  discountType: DiscountType;

  discountAmount: number | null;
  discountPercent: number | null;

  quantity: number | null;

  usageLimitPerMember: number | null;

  usageValidDays: number | null;

  venueLocationIds: number[];
   imageUrl: string;

  startDate: string;
  endDate: string;
};

export type VoucherStatus =
  | "DRAFTED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "ENDED";

export type VoucherLocation = {
  venueLocationId: number;
  venueLocationName: string;
};

export type Voucher = {
  id: number;
  // venueOwnerId: number;
  code: string;

  title: string;
  description?: string;
  imageUrl: string | null;

  voucherPrice: number;

  discountType: DiscountType;
  discountAmount: number | null;
  discountPercent: number | null;

  quantity: number;
  remainingQuantity: number;

  usageLimitPerMember: number | null;
  usageValidDays: number | null;

  rejectReason: string | null;

  startDate: string;
  endDate: string;

  status: VoucherStatus;

  createdAt: string;
  updatedAt: string;

  locations: VoucherLocation[];
};

export type VoucherDetail = Voucher & {
  venueOwnerId: number;
};

//danh sách voucher
export type VoucherListResponse = {
  items: Voucher[];

  pageNumber: number;
  pageSize: number;

  totalCount: number;
  totalPages: number;

  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

//filter cho list
export type VoucherFilterType = {
  keyword: string;
  status: "" | VoucherStatus;
};

//voucher item
export type VoucherItemStatus =
  | "AVAILABLE"
  | "ACQUIRED"
  | "USED"
  | "EXPIRED"
  | "ENDED";

export type VoucherItem = {
  id: number;
  voucherId: number;
  itemCode: string;

  status: VoucherItemStatus;
  isAssigned: boolean;

  expiredAt: string | null;

  createdAt: string;
  updatedAt: string;
};

export type VoucherItemListResponse = {
  items: VoucherItem[];

  pageNumber: number;
  pageSize: number;

  totalCount: number;
  totalPages: number;

  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

//summary
export type VoucherSummary = {
  id: number;
  code: string;
  title: string;
  status: string;

  totalQuantity: number;
  remainingQuantity: number;

  acquiredCount: number;
  usedCount: number;

  expiredCount: number;
  endedCount: number;

  availableCount: number;
  usageRate: number;

  startDate: string;
  endDate: string;
};

//flow exchange voucher
export type VoucherExchangeItem = {
  voucherItemId: number;
  voucherId: number;
  voucherItemMemberId: number;

  itemCode: string;
  status: "ACQUIRED" | "USED" | "EXPIRED";

  memberId: number;
  memberName: string;
  memberEmail: string;
  memberPhone: string;

  quantity: number;
  totalPointsUsed: number;

  note: string;

  acquiredAt: string;
  usedAt: string | null;
  expiredAt: string;
};

export type Pagination<T> = {
  items: T[];

  pageNumber: number;
  pageSize: number;

  totalCount: number;
  totalPages: number;

  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

//flow redeem voucher
export type VoucherRedemptionItem = {
  voucherItemId: number;
  voucherId: number;
  voucherItemMemberId: number;

  itemCode: string;
  status: "USED";

  memberId: number;
  memberName: string;
  memberEmail: string;
  memberPhone: string;

  quantity: number;
  totalPointsUsed: number;

  note: string;

  acquiredAt: string;
  usedAt: string | null;
  expiredAt: string;
};

export type VoucherRedemptionListResponse = {
  items: VoucherRedemptionItem[];

  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;

  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type ValidateVoucherItemData = {
  id: number;
  voucherId: number;
  itemCode: string;

  status: string;
  isValid: boolean;
  validationMessage: string | null;

  voucherTitle: string;
  voucherDescription: string;

  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountAmount: number | null;
  discountPercent: number | null;

  acquiredAt: string | null;
  expiredAt: string | null;
  usedAt: string | null;

  member: any | null;
};