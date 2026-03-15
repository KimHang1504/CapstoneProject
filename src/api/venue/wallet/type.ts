export type Wallet = {
    walletId: number;
    balance: number;
    points: number;
    isActive: boolean;
};

export type WalletBalanceResponse = Wallet;

export type BankInfo = {
    bankName: string;
    accountNumber: string;
    accountName: string;
};

export type WithdrawRequest = {
    id: number;
    walletId: number;
    amount: number;
    status: string;
    rejectionReason?: string | null;
    proofImageUrl?: string | null;
    requestedAt: string;
    bankInfo?: BankInfo;
};

export type WithdrawWalletRequest = {
    amount: number;
    bankInfo: BankInfo;
};

export type WithdrawResponse = {
    requestId?: number;
    amount: number;
    status?: string;
};