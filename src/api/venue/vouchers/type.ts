export type DiscountType =
  | "FIXED_AMOUNT"
  | "PERCENTAGE";

export type CreateVoucherRequest = {
  title: string;
  description?: string;

  pointPrice: number;

  discountType: DiscountType;

  discountAmount: number | null;
  discountPercent: number | null;

  quantity: number;

  usageLimitPerMember: number | null;

  usageValidDays: number;

  venueLocationIds: number[];

  startDate: string;
  endDate: string;
};

export type VoucherStatus =
  | "DRAFTED"
  | "PENDING"
  | "APPROVED"
  | "ACTIVE"
  | "ENDED";

export type Voucher = {
  id: number;
  title: string;
  description?: string;

  discountType: DiscountType;

  discountAmount: number | null;
  discountPercent: number | null;

  quantity: number;

  startDate: string;
  endDate: string;

  status: VoucherStatus;
};