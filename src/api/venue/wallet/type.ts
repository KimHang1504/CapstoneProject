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

export type TransactionDirection = 'IN' | 'OUT';

export type TransactionType = 
    | 'ADS_ORDER' 
    | 'VENUE_SUBSCRIPTION' 
    | 'REFUND' 
    | 'DEPOSIT' 
    | 'WITHDRAW';

export type WalletTransaction = {
    transactionId: number;
    amount: number;
    currency: string;
    paymentMethod: string;
    transactionType: TransactionType;
    description: string;
    status: string;
    createdAt: string;
    direction: TransactionDirection;
    balanceChange: number;
};

export type PaginatedTransactionResponse = {
    items: WalletTransaction[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
};

export type WalletTopupRequest = {
    amount: number;
};

export type WalletTopupResponse = {
    isSuccess: boolean;
    message: string;
    transactionId: number;
    amount: number;
    currency: string;
    paymentContent: string;
    qrCodeUrl?: string | null;
    expireAt?: string | null;
    bankInfo?: BankInfo | null;
};