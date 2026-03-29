/**
 * Types cho Venue Profile
 */

export type VenueProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateVenueOwnerProfilePayload = {
  businessName: string;
  phoneNumber: string;
  email: string;
  citizenIdFrontUrl: string;
  citizenIdBackUrl: string;
};

export type VenueOwnerProfile = {
  id: number;
  businessName: string;
  phoneNumber: string;
  email: string;
  address: string;
  citizenIdFrontUrl: string;
  citizenIdBackUrl: string;
  businessLicenseUrl: string | null;
};
