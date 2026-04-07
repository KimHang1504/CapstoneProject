'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { updateUser } from '@/api/admin/user/api';
import { Users } from '@/api/admin/user/type';
import { User } from 'lucide-react';

type StatusToggleButtonProps = {
    user: Users;
    onUpdated: (updatedUser: Users) => void;
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
                role: user.role,
                isActive: newStatus,
            });

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
        relative w-23 h-9 rounded-full border-2 transition-all duration-300 shadow-sm
        disabled:opacity-60 disabled:cursor-not-allowed
        ${user.isActive
                    ? 'border-pink-300 bg-pink-50 hover:bg-pink-100 hover:border-pink-400'
                    : 'border-purple-300 bg-purple-50 hover:bg-purple-100 hover:border-purple-400'}
      `}
        >
            <span
                className={`
          absolute top-1/2 -translate-y-1/2 flex items-center justify-center
 w-6.5 h-6.5 rounded-full text-white shadow-md
           transition-all duration-300
          ${user.isActive
                        ? 'left-15 bg-gradient-to-r from-pink-400 to-pink-300'
                        : 'left-1 bg-gradient-to-r from-purple-400 to-purple-300'}
        `}
            >
                <User
                    size={14}
                    strokeWidth={2.5}
                    className={user.isActive ? 'text-pink-100' : 'text-purple-100'}
                />      </span>

            <span
                className={`
          absolute inset-0 flex items-center text-[11px] font-bold transition-all duration-300
          ${user.isActive
                        ? 'justify-start pl-3 text-pink-600'
                        : 'justify-end pr-3 text-purple-600'}
        `}
            >
                {loading ? '...' : user.isActive ? 'ON' : 'OFF'}
            </span>
        </button>
    );
}