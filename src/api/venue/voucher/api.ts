/**
 * API cho Venue Voucher
 */

import { apiClient } from '@/lib/api-client';
import { Voucher, CreateVoucherDto } from './type';

export const venueVoucherApi = {
  // Lấy danh sách vouchers
  getVouchers: async (venueId: string, params?: { status?: string }) => {
    return apiClient.get<Voucher[]>(`/api/venue/${venueId}/vouchers`, {
      params,
    });
  },

  // Lấy chi tiết voucher
  getVoucher: async (venueId: string, voucherId: string) => {
    return apiClient.get<Voucher>(
      `/api/venue/${venueId}/vouchers/${voucherId}`
    );
  },

  // Tạo voucher mới
  createVoucher: async (venueId: string, data: CreateVoucherDto) => {
    return apiClient.post<Voucher>(`/api/venue/${venueId}/vouchers`, data);
  },

  // Cập nhật voucher
  updateVoucher: async (
    venueId: string,
    voucherId: string,
    data: Partial<CreateVoucherDto>
  ) => {
    return apiClient.put<Voucher>(
      `/api/venue/${venueId}/vouchers/${voucherId}`,
      data
    );
  },

  // Xóa voucher
  deleteVoucher: async (venueId: string, voucherId: string) => {
    return apiClient.delete(`/api/venue/${venueId}/vouchers/${voucherId}`);
  },
};
