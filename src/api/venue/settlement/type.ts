import { ApiResponse } from "@/lib/api-client";

export type SettlementSummary = {
  pendingAmount: number;
  paidAmount: number;
  cancelledAmount: number;
  pendingCount: number;
  paidCount: number;
  cancelledCount: number;
};

export type SettlementSummaryResponse = ApiResponse<SettlementSummary>;

export type SettlementStatus = "PENDING" | "PAID" | "CANCELLED";

export type SettlementItem = {
  settlementId: number;
  voucherItemId: number;
  voucherItemCode: string;
  voucherTitle: string;
  grossAmount: number;
  commissionAmount: number;
  netAmount: number;
  status: SettlementStatus;
  usedAt: string;
  availableAt: string;
  paidAt: string | null;
  note: string;
};

export type SettlementListData = {
  items: SettlementItem[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type SettlementListResponse = ApiResponse<SettlementListData>;

export type GetSettlementListParams = {
  PageNumber?: number;
  PageSize?: number;
  Status?: SettlementStatus;
  FromDate?: string;
  ToDate?: string;
  SortBy?: "createdAt" | "updatedAt";
  OrderBy?: "asc" | "desc";
};

export type SettlementDetail = {
  settlementId: number;
  voucherItemId: number;
  voucherItemCode: string;
  voucherTitle: string;
  memberName: string;
  grossAmount: number;
  commissionAmount: number;
  netAmount: number;
  status: SettlementStatus;
  usedAt: string;
  availableAt: string;
  paidAt: string | null;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type SettlementDetailResponse = ApiResponse<SettlementDetail>;

export type CommissionConfig = {
  id: number;
  configKey: string;
  configValue: string; // "15"
  description: string;
  updatedAt: string;
};

export type CommissionResponse = ApiResponse<CommissionConfig>;