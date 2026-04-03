export type SimpleUserProfile = {
  citizenIdFrontUrl?: string | null;
  citizenIdBackUrl?: string | null;
};

export const checkAdvertisementOwnerVerification = (
  userProfile: SimpleUserProfile | null | undefined
) => {
  const missingCitizenId =
    !userProfile?.citizenIdFrontUrl || !userProfile?.citizenIdBackUrl;

  return {
    missingCitizenId,
  };
};