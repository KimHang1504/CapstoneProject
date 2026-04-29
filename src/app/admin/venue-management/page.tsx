'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Search, ChevronLeft, ChevronsLeft, ChevronsRight, MapPin, RefreshCw, X, Star, Phone, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { getAllPendingVenues } from '@/api/admin/api';
import { Venue } from '@/api/admin/type';

type StatusFilter = 'all' | 'PENDING' | 'ACTIVE' | 'INACTIVE';

export default function MyLocationPage() {
    const PAGE_SIZE = 10;

    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [searchInput, setSearchInput] = useState('');
    const [data, setData] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);

    // Stats from API
    const [stats, setStats] = useState({
        all: 0,
        PENDING: 0,
        ACTIVE: 0,
        INACTIVE: 0,
    });

    useEffect(() => {
        fetchData();
    }, [statusFilter]);

    useEffect(() => {
        setPage(1);
    }, [statusFilter, searchInput]);

    const normalizeVietnamese = (value: string) =>
        value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toLowerCase()
            .trim();

    const filteredData = useMemo(() => {
        const keyword = normalizeVietnamese(searchInput);
        if (!keyword) return data;

        return data.filter((loc) => {
            const name = normalizeVietnamese(loc.name ?? '');
            const address = normalizeVietnamese(loc.address ?? '');
            const description = normalizeVietnamese(loc.description ?? '');

            return name.includes(keyword) || address.includes(keyword) || description.includes(keyword);
        });
    }, [data, searchInput]);

    const totalCount = filteredData.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const pagedData = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredData.slice(start, start + PAGE_SIZE);
    }, [filteredData, page]);

    const fetchData = async () => {
        setLoading(true);

        try {
            const status = statusFilter === 'all' ? undefined : statusFilter;
            const pageSize = 100;
            let currentPage = 1;
            let apiTotalPages = 1;
            const allVenues: Venue[] = [];

            do {
                const res = await getAllPendingVenues(currentPage, pageSize, status, undefined);
                allVenues.push(...res.data.items);
                apiTotalPages = res.data.totalPages;
                currentPage += 1;
            } while (currentPage <= apiTotalPages);

            setData(allVenues);

            // Fetch stats for all statuses
            await fetchStats();
            console.log('Fetched venues:', allVenues);

        } catch (error) {
            console.error('Error fetching venues:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const [allRes, pendingRes, activeRes, inactiveRes] = await Promise.all([
                getAllPendingVenues(1, 1, undefined, undefined),
                getAllPendingVenues(1, 1, 'PENDING', undefined),
                getAllPendingVenues(1, 1, 'ACTIVE', undefined),
                getAllPendingVenues(1, 1, 'INACTIVE', undefined),
            ]);

            setStats({
                all: allRes.data.totalCount,
                PENDING: pendingRes.data.totalCount,
                ACTIVE: activeRes.data.totalCount,
                INACTIVE: inactiveRes.data.totalCount,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleStatusChange = (status: StatusFilter) => {
        setStatusFilter(status);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50/40 to-violet-50/30">
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex gap-6 items-start">
                    {/* MAIN CONTENT */}
                    <div className="flex-1 min-w-0 space-y-5">
                        {/* HEADER */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
                                    <MapPin className="w-6 h-6 text-violet-600" />
                                    Quản lý địa điểm
                                </h1>
                                <p className="text-sm text-slate-500 mt-1.5">
                                    {totalCount} địa điểm
                                </p>
                            </div>

                            <button
                                onClick={fetchData}
                                disabled={loading}
                                className="group px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-violet-50 hover:border-violet-200 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow flex items-center gap-2"
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
                                        className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white hover:bg-slate-50 transition-all duration-200"
                                    />
                                    {searchInput && (
                                        <button
                                            onClick={() => {
                                                setSearchInput("");
                                                setPage(1);
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setPage(1)}
                                    className="px-6 py-2.5 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 shadow-md"
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
                                pagedData.map(loc => {
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
                                                className="relative bg-white rounded-xl border border-slate-200 hover:shadow-md hover:border-violet-200 transition-all duration-200 shadow-sm overflow-hidden"
                                            >
                                                <div className="flex gap-4 p-4">
                                                    {/* IMAGE */}
                                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                                                        <Image
                                                            src={imageUrl}
                                                            alt={loc.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        {/* Title and Status */}
                                                        <div className="flex items-start justify-between gap-2 mb-1">
                                                            <Link
                                                                href={`/admin/venue-management/location/${loc.id}`}
                                                            >
                                                                <h3 className="font-semibold text-lg text-slate-800 hover:text-violet-600 transition-colors line-clamp-1">
                                                                    {loc.name}
                                                                </h3>
                                                            </Link>
                                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0
                                                            ${loc.status === "ACTIVE"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : loc.status === "PENDING"
                                                                        ? "bg-yellow-100 text-yellow-700"
                                                                        : loc.status === "DRAFTED"
                                                                            ? "bg-slate-100 text-slate-700"
                                                                            : "bg-red-100 text-red-700"
                                                                }`}
                                                            >
                                                                {loc.status === "ACTIVE" && "Hoạt động"}
                                                                {loc.status === "PENDING" && "Đang chờ duyệt"}
                                                                {loc.status === "INACTIVE" && "Không hoạt động"}
                                                            </span>
                                                        </div>

                                                        {/* Description */}
                                                        <p className="text-sm text-slate-600 line-clamp-1">
                                                            {loc.description ?? 'Không có mô tả'}
                                                        </p>

                                                        {/* Address */}
                                                        <p className="text-sm text-slate-700 font-medium mt-1 line-clamp-1">
                                                            {loc.address ?? 'Chưa có địa chỉ'}
                                                        </p>

                                                        {/* Secondary Info Row */}
                                                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                                                            {/* Category */}
                                                            {loc.categories && (
                                                                loc.categories.length > 0 ? (
                                                                    loc.categories.map(cat => (
                                                                        <span key={cat.id} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                                                                            {cat.name}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full">
                                                                        Không có danh mục
                                                                    </span>
                                                                )
                                                            )}

                                                            {/* Rating */}
                                                            {loc.averageRating !== undefined && loc.averageRating > 0 && (
                                                                <div className="flex items-center gap-1 text-yellow-600">
                                                                    <Star className="w-3.5 h-3.5 fill-yellow-400" />
                                                                    <span className="font-medium">{loc.averageRating.toFixed(1)}</span>
                                                                    {loc.reviewCount && <span className="text-slate-500">({loc.reviewCount})</span>}
                                                                </div>
                                                            )}

                                                            {/* Verification Status */}
                                                            {loc.isOwnerVerified && (
                                                                <div className="flex items-center gap-1 text-green-600">
                                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                                    <span className="font-medium">Đã xác thực</span>
                                                                </div>
                                                            )}

                                                            {/* Contact Info */}
                                                            {(loc.phoneNumber || loc.email) && (
                                                                <div className="flex items-center gap-1.5">
                                                                    {loc.phoneNumber && (
                                                                        <div className="flex items-center gap-1 text-slate-600 hover:text-violet-600">
                                                                            <Phone className="w-3.5 h-3.5" />
                                                                            <span className="text-xs">{loc.phoneNumber}</span>
                                                                        </div>
                                                                    )}
                                                                    {loc.email && (
                                                                        <div className="flex items-center gap-1 text-slate-600 hover:text-violet-600">
                                                                            <Mail className="w-3.5 h-3.5" />
                                                                            <span className="text-xs truncate">{loc.email}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Price Range */}
                                                            {loc.priceMin != null && loc.priceMax != null && loc.priceMin > 0 && loc.priceMax > 0 ? (
                                                                <span className="text-slate-700 font-medium">
                                                                    {loc.priceMin.toLocaleString('vi-VN')} - {loc.priceMax.toLocaleString('vi-VN')} đ
                                                                </span>
                                                            ) : (
                                                                <span className="text-slate-500 text-sm italic">
                                                                    Chưa cập nhật giá
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <Link
                                                        href={`/admin/venue-management/location/${loc.id}`}
                                                        className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600 hover:bg-violet-200 transition-colors shrink-0"
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}

                            {!loading && filteredData.length === 0 && (
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
                                                        className={`min-w-[36px] px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${page === pageNum
                                                            ? "bg-linear-to-r from-violet-600 to-purple-600 text-white shadow-md"
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

                        {[
                            { key: 'all', label: 'Tất cả', value: stats.all },
                            { key: 'PENDING', label: 'Chờ duyệt', value: stats.PENDING },
                            { key: 'ACTIVE', label: 'Đã duyệt', value: stats.ACTIVE },
                            { key: 'INACTIVE', label: 'Không hoạt động', value: stats.INACTIVE },
                        ].map(item => (
                            <div
                                key={item.key}
                                onClick={() => handleStatusChange(item.key as StatusFilter)}
                                className={`cursor-pointer rounded-xl p-4 transition-all duration-300 border group ${statusFilter === item.key
                                    ? 'bg-linear-to-br from-violet-50 to-purple-50 border-violet-300 shadow-lg scale-105'
                                    : 'bg-white border-slate-200 hover:bg-purple-50/30 hover:border-violet-200 shadow-sm hover:shadow-md'
                                    }`}
                            >
                                <p className={`text-xs font-semibold uppercase tracking-widest transition-colors duration-300 ${statusFilter === item.key ? 'text-violet-600' : 'text-slate-500'
                                    }`}>
                                    {item.label}
                                </p>
                                <p className={`text-3xl font-bold mt-2 transition-colors duration-300 ${statusFilter === item.key ? 'text-violet-600' : 'text-slate-800 group-hover:text-violet-600'
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