import { apiClient, ApiResponse } from "@/lib/api-client";
import {
  WalletBalanceResponse,
  WalletTopupRequest,
  WalletTopupResponse,
  WithdrawRequest,
  WithdrawResponse,
  WithdrawWalletRequest,
} from "./type";

export async function getWalletBalance() {
  const res = await apiClient.get<ApiResponse<WalletBalanceResponse>>(
    "/api/Wallet/balance"
  );

  return res.data;
}

export async function withdrawWallet(data: WithdrawWalletRequest) {
  const res = await apiClient.post<ApiResponse<WithdrawResponse>>(
    "/api/Wallet/withdraw",
    data
  );

  return res.data;
}

export async function getWithdrawRequests() {
  const res = await apiClient.get<ApiResponse<WithdrawRequest[]>>(
    "/api/Wallet/withdraw-requests"
  );

  return res.data;
}

export async function getTransactionHistory(pageNumber: number = 1, pageSize: number = 5) {
  const res = await apiClient.get<ApiResponse<import("./type").PaginatedTransactionResponse>>(
    "/api/Wallet/transaction-history",
    { params: { pageNumber, pageSize } }
  );

  return res.data;
}

export async function createWalletTopup(data: WalletTopupRequest) {
  const res = await apiClient.post<ApiResponse<WalletTopupResponse>>(
    "/api/Wallet/topup",
    data
  );

  return res.data;
}