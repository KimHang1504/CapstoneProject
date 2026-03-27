'use client';

import { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, Loader, Users as UsersIcon, RefreshCw, X, ChevronsLeft, ChevronsRight } from 'lucide-react';
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
                pageSize: 5,
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
        return colorMap[role] || 'bg-slate-100 text-slate-700';
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
            <div className="max-w-7xl mx-auto p-6 space-y-5">
                {/* HEADER */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
                            <UsersIcon className="w-6 h-6 text-blue-600" />
                            Quản lý người dùng
                        </h1>
                        <p className="text-sm text-slate-500 mt-1.5">
                            {users.length} người dùng
                        </p>
                    </div>

                    <button
                        onClick={() => fetchUsers(page)}
                        disabled={loading}
                        className="group px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        <span className="text-sm font-medium">Tải lại</span>
                    </button>
                </div>

                {/* SEARCH */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Tìm theo tên, email hoặc số điện thoại..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-slate-50 transition-all duration-200"
                            />
                            {inputValue && (
                                <button
                                    onClick={() => {
                                        setInputValue("");
                                        setSearchTerm("");
                                        setPage(1);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={handleSearch}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 shadow-md"
                        >
                            <span className="text-sm font-medium">Tìm kiếm</span>
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader className="animate-spin text-blue-600" size={32} />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="py-16 text-center">
                            <div className="flex flex-col items-center justify-center text-slate-400">
                                <UsersIcon className="w-16 h-16 mb-3 text-slate-300" strokeWidth={1.5} />
                                <p className="text-sm font-medium text-slate-600">Không có người dùng nào</p>
                                <p className="text-xs text-slate-400 mt-1">Các người dùng sẽ hiển thị ở đây</p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                            Họ tên
                                        </th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                            Số điện thoại
                                        </th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                            Vai trò
                                        </th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-4 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200">
                                    {filteredUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors duration-150"
                                        >
                                            <td className="px-4 py-4">
                                                <span className="text-sm font-semibold text-slate-700">
                                                    {user.fullName}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="text-sm text-slate-600">
                                                    {user.email}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="text-sm text-slate-600">
                                                    {user.phoneNumber}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getRoleColor(
                                                        user.role
                                                    )}`}
                                                >
                                                    {getRoleLabel(user.role)}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <StatusToggleButton
                                                    user={user}
                                                    onUpdated={handleUserUpdated}
                                                />
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => openDetailModal(user)}
                                                        className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* PAGINATION */}
                {!loading && totalPages > 1 && (
                    <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-600">
                                    Trang <span className="font-semibold text-slate-800">{page}</span> / <span className="font-semibold text-slate-800">{totalPages}</span>
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(1)}
                                    disabled={page === 1}
                                    className="p-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
                                    title="Trang đầu"
                                >
                                    <ChevronsLeft className="w-4 h-4 text-slate-600" />
                                </button>
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
                                    title="Trang trước"
                                >
                                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                                </button>
                                
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (page <= 3) {
                                            pageNum = i + 1;
                                        } else if (page >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = page - 2 + i;
                                        }
                                        
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`min-w-[36px] px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                    page === pageNum
                                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                                                        : "border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
                                    title="Trang sau"
                                >
                                    <ChevronRight className="w-4 h-4 text-slate-600" />
                                </button>
                                <button
                                    onClick={() => setPage(totalPages)}
                                    disabled={page === totalPages}
                                    className="p-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
                                    title="Trang cuối"
                                >
                                    <ChevronsRight className="w-4 h-4 text-slate-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <UserDetailPopup
                    open={isDetailOpen}
                    loading={false}
                    user={selectedUser}
                    onClose={closeDetailModal}
                />
            </div>
        </div>
    );
}