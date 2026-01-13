/**
 * API cho Venue Profile
 * Ví dụ về cách sử dụng apiClient
 */

import { apiClient } from '@/lib/api-client';
import { VenueProfile } from './type';

export const venueProfileApi = {
  // Lấy thông tin profile
  getProfile: async (venueId: string) => {
    return apiClient.get<VenueProfile>(`/api/venue/${venueId}/profile`);
  },

  // Cập nhật profile
  updateProfile: async (venueId: string, data: Partial<VenueProfile>) => {
    return apiClient.put<VenueProfile>(`/api/venue/${venueId}/profile`, data);
  },

  // Upload avatar
  uploadAvatar: async (venueId: string, file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    return apiClient.post(`/api/venue/${venueId}/avatar`, formData, {
      headers: {
        // Không set Content-Type, để browser tự set cho FormData
      },
    });
  },
};
