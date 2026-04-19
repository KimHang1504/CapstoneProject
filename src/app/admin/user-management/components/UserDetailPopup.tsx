'use client';

import { useEffect } from 'react';
import {
  X,
  Mail,
  Phone,
  Shield,
  Calendar,
  UserCircle2,
} from 'lucide-react';
import { Users } from '@/api/admin/user/type';

type UserDetailPopupProps = {
  open: boolean;
  loading: boolean;
  user: Users | null;
  onClose: () => void;
};

const formatDate = (value?: string | null) => {
  if (!value) return '---';
  return new Date(value).toLocaleString('vi-VN');
};

const getRoleLabel = (role?: string) => {
  switch (role) {
    case 'ADMIN':
      return 'Quản trị viên';
    case 'STAFF':
      return 'Nhân viên';
    case 'MEMBER':
      return 'Thành viên';
    case 'VENUEOWNER':
      return 'Chủ sân';
    default:
      return role || '---';
  }
};

export default function UserDetailPopup({
  open,
  loading,
  user,
  onClose,
}: UserDetailPopupProps) {
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-fuchsia-100 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        <div className="border-b border-fuchsia-100 px-6 py-5">
          <h2 className="text-lg font-semibold text-fuchsia-700">
            Chi tiết người dùng
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Thông tin tài khoản
          </p>
        </div>

        <div className="px-6 py-5">
          {loading ? (
            <div className="flex h-52 items-center justify-center text-sm text-gray-500">
              Đang tải dữ liệu...
            </div>
          ) : !user ? (
            <div className="flex h-52 items-center justify-center text-sm text-red-500">
              Không có dữ liệu người dùng
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-4 rounded-xl bg-fuchsia-50 px-4 py-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white border border-fuchsia-100">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserCircle2 size={30} className="text-fuchsia-300" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-gray-800">
                    {user.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {user.id}</p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-fuchsia-600 border border-fuchsia-100">
                      {getRoleLabel(user.role)}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : 'bg-rose-50 text-rose-500 border border-rose-100'
                      }`}
                    >
                      {user.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <InfoCard icon={<Mail size={16} />} label="Email" value={user.email || '---'} />
                <InfoCard icon={<Phone size={16} />} label="Số điện thoại" value={user.phoneNumber || '---'} />
                <InfoCard icon={<Shield size={16} />} label="Vai trò" value={getRoleLabel(user.role)} />
                <InfoCard icon={<Calendar size={16} />} label="Đăng nhập gần nhất" value={formatDate(user.lastLoginAt)} />
                <InfoCard icon={<Calendar size={16} />} label="Ngày tạo" value={formatDate(user.createdAt)} />
                <InfoCard icon={<Calendar size={16} />} label="Cập nhật lần cuối" value={formatDate(user.updatedAt)} />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-fuchsia-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-fuchsia-100 px-4 py-2 text-sm font-medium text-fuchsia-700 hover:bg-fuchsia-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

type InfoCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <div className="rounded-xl border border-fuchsia-100 bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-fuchsia-700">
        {icon}
        <span>{label}</span>
      </div>
      <p className="break-words text-sm text-gray-700">{value}</p>
    </div>
  );
}