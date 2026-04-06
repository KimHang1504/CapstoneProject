import { UserProfile } from '@/api/auth/type';
import { VenueLocationDetail } from '@/api/venue/location/type';

export function   checkVenueOwnerVerification(userProfile: UserProfile | null) {
  const venueOwnerProfile = userProfile?.venueOwnerProfile;

  const missingCitizenId =
    !venueOwnerProfile?.citizenIdFrontUrl ||
    !venueOwnerProfile?.citizenIdBackUrl;

  return {
    missingCitizenId,
  };
}

export function getLocationSubmitErrors(location: VenueLocationDetail) {
  const errors: string[] = [];

  if (!location.name) errors.push('Tên địa điểm');
  if (!location.description) errors.push('Mô tả');
  if (!location.address) errors.push('Địa chỉ');
  if (!location.email) errors.push('Email');
  if (!location.latitude || !location.longitude) errors.push('Vị trí trên bản đồ');
  if (!location.websiteUrl) errors.push('Website');
  if (!location.phoneNumber) errors.push('Số điện thoại');
  if (!location.priceMin || !location.priceMax) errors.push('Khoảng giá');
  if (!location.coverImage?.length) errors.push('Hình ảnh bìa');
  // if (!location.interiorImage?.length) errors.push('Hình ảnh nội thất');
  // if (!location.fullPageMenuImage?.length) errors.push('Hình ảnh menu');
  // if (!location.businessLicenseUrl?.length) errors.push('Hình ảnh giấy phép kinh doanh');


  const hasCategories =
    (location.categories && location.categories.length > 0) ||
    !!location.category;

  if (!hasCategories) errors.push('Danh mục');

  const hasMoodTypes =
    location.locationTags?.some((tag) => !!tag.coupleMoodType) ?? false;

  if (!hasMoodTypes) errors.push('Tâm trạng');

  const hasPersonalityTypes =
    location.locationTags?.some((tag) => !!tag.couplePersonalityType) ?? false;

  if (!hasPersonalityTypes) errors.push('Tính cách');

  return errors;
}