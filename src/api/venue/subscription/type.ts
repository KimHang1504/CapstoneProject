export type SubscriptionPackage = {
  id: number;
  packageName: string;
  price: number;
  durationDays: number;
  type: 'VENUE' | 'MEMBER';
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
