'use client';

import { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, Loader } from 'lucide-react';
import { getListUsers } from '@/api/admin/user/api';
import { Users } from '@/api/admin/user/type';
import { toast } from 'sonner';
import StatusToggleButton from '@/app/admin/user-management/components/status-toggle-button';
import UserDetailPopup from '@/app/admin/user-management/components/UserDetailPopup';

export default function UserManagementPage() {
    const [users, setUsers] = useState<Users[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState<Users | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const fetchUsers = async (pageNum: number) => {
        setLoading(true);
        try {
            const res = await getListUsers({
                pageNumber: pageNum,
                pageSize: 10,
                searchTerm: searchTerm || undefined,
            });
            setUsers(res.items);
            setTotalPages(res.totalPages);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách người dùng');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page, searchTerm]);

    const handleSearch = () => {
        setSearchTerm(inputValue);
        setPage(1);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const filteredUsers = users;

    const getRoleLabel = (role: string) => {
        const roleMap: Record<string, string> = {
            ADMIN: 'Quản trị viên',
            STAFF: 'Nhân viên',
            MEMBER: 'Thành viên',
            VENUEOWNER: 'Chủ venue',
        };
        return roleMap[role] || role;
    };


    const getRoleColor = (role: string) => {
        const colorMap: Record<string, string> = {
            ADMIN: 'bg-red-100 text-red-700',
            STAFF: 'bg-blue-100 text-blue-700',
            MEMBER: 'bg-green-100 text-green-700',
            VENUEOWNER: 'bg-purple-100 text-purple-700',
        };
        return colorMap[role] || 'bg-gray-100 text-gray-700';
    };

    const openDetailModal = (user: Users) => {
        setSelectedUser(user);
        setIsDetailOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailOpen(false);
        setSelectedUser(null);
    };

    const handleUserUpdated = (updatedUser: Users) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );

        if (selectedUser?.id === updatedUser.id) {
            setSelectedUser(updatedUser);
        }
    };

    return (
        <div className="flex-1 space-y-6 p-6 bg-linear-to-br from-purple-50 via-pink-50 to-purple-100 min-h-screen">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Quản lý Người dùng
                </h1>

                <div className="relative flex gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 text-purple-400" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm theo tên, email hoặc số điện thoại..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <button
                        onClick={handleSearch}
                        className="px-6 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition font-medium"
                    >
                        Tìm kiếm
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-200">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader className="animate-spin text-purple-600" size={32} />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">
                        <p className="text-lg">Không có người dùng nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-linear-to-r from-purple-100 to-pink-100 border-b border-purple-200">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">
                                        Họ tên
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">
                                        Số điện thoại
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">
                                        Vai trò
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-900">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUsers.map((user, idx) => (
                                    <tr
                                        key={user.id}
                                        className={`border-b border-purple-100 hover:bg-purple-50 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-purple-50/30'
                                            }`}
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {user.fullName}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {user.email}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {user.phoneNumber}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(
                                                    user.role
                                                )}`}
                                            >
                                                {getRoleLabel(user.role)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            <StatusToggleButton
                                                user={user}
                                                onUpdated={handleUserUpdated}
                                            />
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => openDetailModal(user)}
                                                className="p-2 hover:bg-purple-100 text-purple-600 rounded-lg transition"
                                                title="Xem chi tiết"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && users.length > 0 && (
                    <div className="flex justify-between items-center px-6 py-4 border-t border-purple-100 bg-purple-50/50">
                        <div className="text-sm text-gray-600">
                            Trang {page} / {totalPages}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 hover:bg-purple-100 text-purple-600 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 hover:bg-purple-100 text-purple-600 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <UserDetailPopup
                open={isDetailOpen}
                loading={false}
                user={selectedUser}
                onClose={closeDetailModal}
            />
        </div>
    );
}