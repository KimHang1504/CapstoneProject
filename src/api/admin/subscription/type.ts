export type PackageType = "MEMBER" | "VENUE" | "VENUEOWNER";

export interface SubscriptionPackage {
  id: number;
  packageName: string;
  price: number;
  durationDays: number;
  type: PackageType;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionPackageRequest {
  packageName: string;
  price: number;
  durationDays: number;
  type: PackageType;
  description?: string;
  isActive?: boolean;
}

export interface UpdateSubscriptionPackageRequest {
  packageName: string;
  price: number;
  durationDays: number;
  description?: string;
  isActive?: boolean;
}

export interface GetPackagesParams {
  type?: PackageType;
}
