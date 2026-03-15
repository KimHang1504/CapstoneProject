import { apiClient, ApiResponse } from "@/lib/api-client";
import {
  WalletBalanceResponse,
  WithdrawRequest,
  WithdrawResponse,
} from "./type";


export async function getWalletBalance() {
  const res = await apiClient.get<ApiResponse<WalletBalanceResponse>>(
    "/api/Wallet/balance"
  );

  return res.data;
}


export async function withdrawWallet(data: WithdrawRequest) {
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