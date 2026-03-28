export type SubscriptionPackage = {
  id: number;
  packageName: string;
  price: number;
  durationDays: number;
  type: 'VENUE' | 'MEMBER' | 'VENUEOWNER';
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetSubscriptionPackagesResponse = {
  message: string;
  code: number;
  data: SubscriptionPackage[];
  traceId?: string;
  timestamp?: string;
};

export type MySubscription = {
  id: number;
  venueId: number;
  packageId: number;
  startDate: string | null;
  endDate: string | null;
  quantity: number;
  status: 'ACTIVE' | 'CANCELLED' | 'PENDING_PAYMENT' | 'REFUNDED' | 'EXPIRED';
  venueName: string;
  createdAt: string;
  package: SubscriptionPackage;
};

export type GetMySubscriptionsResponse = {
  message: string;
  code: number;
  data: MySubscription[];
  traceId?: string;
  timestamp?: string;
};

export type PurchaseSubscriptionRequest = {
  packageId: number;
  quantity: number;
  paymentMethod: 'VIETQR' | 'WALLET';
};

export type PurchaseSubscriptionResponse = {
  isSuccess: boolean;
  message: string;
  transactionId: number;
  subscriptionId: number;
  qrCodeUrl: string;
  amount: number;
  paymentContent: string;
  packageName: string;
  totalDays: number;
  expireAt: string;
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
};
