'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { updateUser } from '@/api/admin/user/api';
import {Users } from '@/api/admin/user/type';
import { User } from 'lucide-react';

type StatusToggleButtonProps = {
  user: Users;
  onUpdated: (updatedUser: Users) => void;
};

const mapRoleToApi = (role: Users['role']): 'Admin' | 'User' => {
  return role === 'ADMIN' ? 'Admin' : 'User';
};

export default function StatusToggleButton({
  user,
  onUpdated,
}: StatusToggleButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async () => {
    if (loading) return;

    const oldStatus = user.isActive;
    const newStatus = !oldStatus;

    onUpdated({
      ...user,
      isActive: newStatus,
    });

    setLoading(true);

    try {
      const updatedUser = await updateUser(user.id, {
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: mapRoleToApi(user.role),
        isActive: newStatus,
      } as any);

      onUpdated({
        ...user,
        ...updatedUser,
        isActive: newStatus,
      });

      toast.success(
        newStatus ? 'Đã chuyển sang hoạt động' : 'Đã chuyển sang không hoạt động'
      );
    } catch (error) {
      onUpdated({
        ...user,
        isActive: oldStatus,
      });

      toast.error('Cập nhật trạng thái thất bại');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleStatus}
      disabled={loading}
      title={user.isActive ? 'Click để khóa tài khoản' : 'Click để kích hoạt tài khoản'}
      className={`
        relative flex items-center w-[92px] h-[36px] rounded-full border-2
        transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed
        ${user.isActive
          ? 'border-green-500 bg-white hover:bg-green-50'
          : 'border-purple-400 bg-white hover:bg-purple-50'}
      `}
    >
      <span
        className={`
          absolute top-1/2 -translate-y-1/2 left-[4px]
          flex items-center justify-center
          w-[26px] h-[26px] rounded-full text-white shadow-sm
          transition-all duration-200
          ${user.isActive ? 'bg-green-500' : 'bg-purple-500'}
        `}
      >
        <User size={14} strokeWidth={2.5} />
      </span>

      <span className="w-full text-center text-[11px] font-semibold pr-2 pl-8">
        {loading ? 'Đang lưu' : user.isActive ? 'ON' : 'OFF'}
      </span>
    </button>
  );
}