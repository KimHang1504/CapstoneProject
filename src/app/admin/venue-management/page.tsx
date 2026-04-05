'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, Search, ChevronLeft, ChevronsLeft, ChevronsRight, MapPin, RefreshCw, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { getAllPendingVenues } from '@/api/admin/api';
import { Venue } from '@/api/admin/type';

type StatusFilter = 'all' | 'DRAFTED' | 'PENDING' | 'ACTIVE' | 'REJECTED';

export default function MyLocationPage() {

    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [clientSearch, setClientSearch] = useState(''); // Frontend search
    const [data, setData] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Stats from API
    const [stats, setStats] = useState({
        all: 0,
        DRAFTED: 0,
        PENDING: 0,
        ACTIVE: 0,
        REJECTED: 0,
    });

    useEffect(() => {
        fetchData();
    }, [page, statusFilter, searchQuery]);

    const fetchData = async () => {
        setLoading(true);

        try {
            const res = await getAllPendingVenues(
                page,
                10,
                statusFilter === 'all' ? undefined : statusFilter,
                searchQuery || undefined
            );

            setData(res.data.items);
            setTotalPages(res.data.totalPages);
            setTotalCount(res.data.totalCount);

            // Fetch stats for all statuses
            await fetchStats();
            console.log('Fetched venues:', res.data.items);

        } catch (error) {
            console.error('Error fetching venues:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const [allRes, draftedRes, pendingRes, activeRes, rejectedRes] = await Promise.all([
                getAllPendingVenues(1, 1, undefined, undefined),
                getAllPendingVenues(1, 1, 'DRAFTED', undefined),
                getAllPendingVenues(1, 1, 'PENDING', undefined),
                getAllPendingVenues(1, 1, 'ACTIVE', undefined),
                getAllPendingVenues(1, 1, 'REJECTED', undefined),
            ]);

            setStats({
                all: allRes.data.totalCount,
                DRAFTED: draftedRes.data.totalCount,
                PENDING: pendingRes.data.totalCount,
                ACTIVE: activeRes.data.totalCount,
                REJECTED: rejectedRes.data.totalCount,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSearch = () => {
        setSearchQuery(searchInput);
        setPage(1);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleStatusChange = (status: StatusFilter) => {
        setStatusFilter(status);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex gap-6 items-start">
                    {/* MAIN CONTENT */}
                    <div className="flex-1 min-w-0 space-y-5">
                        {/* HEADER */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
                                    <MapPin className="w-6 h-6 text-blue-600" />
                                    Quản lý địa điểm
                                </h1>
                                <p className="text-sm text-slate-500 mt-1.5">
                                    {totalCount} địa điểm
                                </p>
                            </div>

                            <button
                                onClick={fetchData}
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
                                        placeholder="Tìm theo tên hoặc địa chỉ..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-slate-50 transition-all duration-200"
                                    />
                                    {searchInput && (
                                        <button
                                            onClick={() => {
                                                setSearchInput("");
                                                setSearchQuery("");
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

                        {/* LOCATIONS LIST */}
                        <div className="space-y-3">
                            {loading &&
                                [...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex gap-4 bg-white rounded-xl p-4 border border-slate-200 animate-pulse shadow-sm"
                                    >
                                        <div className="w-24 h-24 bg-slate-200 rounded-xl" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-1/3 bg-slate-200 rounded" />
                                            <div className="h-3 w-2/3 bg-slate-200 rounded" />
                                            <div className="h-3 w-1/2 bg-slate-200 rounded" />
                                        </div>
                                    </div>
                                ))}

                            {!loading &&
                                data
                                    .filter(loc => {
                                        // Client-side search filter
                                        if (!clientSearch) return true;
                                        const query = clientSearch.toLowerCase();
                                        return (
                                            loc.name?.toLowerCase().includes(query) ||
                                            loc.address?.toLowerCase().includes(query) ||
                                            loc.description?.toLowerCase().includes(query)
                                        );
                                    })
                                    .map(loc => {
                                    // Validate and get image URL
                                    let imageUrl = 'https://i.pinimg.com/736x/36/21/a9/3621a941262c3977faff6f9a47943eee.jpg';
                                    
                                    if (loc.coverImage?.[0]) {
                                        const url = loc.coverImage[0].trim();
                                        // Check if it's a valid URL
                                        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                                            try {
                                                new URL(url);
                                                imageUrl = url;
                                            } catch {
                                                // Invalid URL, use default
                                            }
                                        }
                                    }

                                    return (
                                        <div
                                            key={loc.id}
                                            className="relative flex gap-4 bg-white rounded-xl p-4 border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all duration-200 shadow-sm"
                                        >
                                            {/* IMAGE */}
                                            <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                                                <Image
                                                    src={imageUrl}
                                                    alt={loc.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 pr-10">
                                                <Link href={`/admin/venue-management/location/${loc.id}`}>
                                                    <h3 className="font-semibold text-lg text-slate-800 hover:text-blue-600 transition-colors">
                                                        {loc.name}
                                                    </h3>
                                                </Link>

                                                <p className="text-sm text-slate-600 mt-1 line-clamp-2 min-h-10">
                                                    {loc.description ?? 'Không có mô tả'}
                                                </p>

                                                <p className="text-sm text-slate-700 font-medium italic mt-1 line-clamp-2 min-h-10">
                                                    {loc.address ?? 'Chưa có địa chỉ'}
                                                </p>
                                                <p>
                                                        <span className="text-xs text-slate-500">Trạng thái: </span>
                                                        <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium
                                                            ${loc.status === "ACTIVE"
                                                                ? "bg-green-100 text-green-700" 
                                                                : loc.status === "PENDING"
                                                                    ? "bg-yellow-100 text-yellow-700" 
                                                                    : "bg-gray-200 text-gray-700"
                                                            }`}
                                                        >
                                                            {loc.status}
                                                        </span>
                                                </p>
                                            </div>

                                            <Link
                                                href={`/admin/venue-management/location/${loc.id}`}
                                                className="absolute bottom-4 right-4"
                                            >
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}

                            {!loading && data.filter(loc => {
                                if (!clientSearch) return true;
                                const query = clientSearch.toLowerCase();
                                return (
                                    loc.name?.toLowerCase().includes(query) ||
                                    loc.address?.toLowerCase().includes(query) ||
                                    loc.description?.toLowerCase().includes(query)
                                );
                            }).length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl bg-slate-50 text-center">
                                    <MapPin className="w-16 h-16 text-slate-300 mb-3" strokeWidth={1.5} />
                                    <p className="text-slate-600 font-medium">
                                        Không có địa điểm nào
                                    </p>
                                    <p className="text-sm text-slate-400 mt-1">
                                        Các địa điểm sẽ hiển thị ở đây
                                    </p>
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
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
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
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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
                    </div>

                    {/* SIDEBAR FILTERS */}
                    <div className="w-[280px] space-y-3 sticky top-6 self-start">
                        {/* CLIENT-SIDE SEARCH */}
                        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Lọc nhanh..."
                                    value={clientSearch}
                                    onChange={(e) => setClientSearch(e.target.value)}
                                    className="w-full pl-10 pr-8 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-slate-50 transition-all duration-200"
                                />
                                {clientSearch && (
                                    <button
                                        onClick={() => setClientSearch("")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* STATUS FILTERS */}
                        {[
                            { key: 'all', label: 'Tất cả', value: stats.all },
                            { key: 'DRAFTED', label: 'Nháp', value: stats.DRAFTED },
                            { key: 'PENDING', label: 'Chờ duyệt', value: stats.PENDING },
                            { key: 'ACTIVE', label: 'Đã duyệt', value: stats.ACTIVE },
                            { key: 'REJECTED', label: 'Từ chối', value: stats.REJECTED },
                        ].map(item => (
                            <div
                                key={item.key}
                                onClick={() => handleStatusChange(item.key as StatusFilter)}
                                className={`cursor-pointer rounded-xl p-4 transition-all duration-200 border ${
                                    statusFilter === item.key
                                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md'
                                        : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                                }`}
                            >
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {item.label}
                                </p>
                                <p className={`text-2xl font-bold mt-1 ${
                                    statusFilter === item.key ? 'text-blue-600' : 'text-slate-800'
                                }`}>
                                    {item.value.toString().padStart(2, '0')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}