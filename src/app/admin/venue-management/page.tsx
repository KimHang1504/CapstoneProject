'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Search, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { getAllPendingVenues } from '@/api/admin/api';
import { Venue } from '@/api/admin/type';

type StatusFilter = 'all' | 'PENDING' | 'APPROVED' | 'REJECTED';

export default function MyLocationPage() {

    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [keyword, setKeyword] = useState('');
    const [data, setData] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {

        setLoading(true);

        getAllPendingVenues(page , 10)
            .then(res => {

                setData(res.data.items);
                setTotalPages(res.data.totalPages);

            })
            .finally(() => setLoading(false));

    }, [page]);

    const stats = useMemo(() => {

        return {
            all: data.length,
            PENDING: data.filter(l => l.status === 'PENDING').length,
            APPROVED: data.filter(l => l.status === 'APPROVED').length,
            REJECTED: data.filter(l => l.status === 'REJECTED').length,
        };

    }, [data]);

    const locations = useMemo(() => {

        return data.filter(l => {

            const matchStatus =
                statusFilter === 'all' || l.status === statusFilter;

            const name = l.name?.toLowerCase() ?? '';
            const address = l.address?.toLowerCase() ?? '';
            const key = keyword.toLowerCase();

            const matchKeyword =
                name.includes(key) || address.includes(key);

            return matchStatus && matchKeyword;

        });

    }, [data, statusFilter, keyword]);

    return (
        <div className="flex gap-10 p-8 items-start">

            <div className="flex-1 min-w-0 space-y-4">

                {loading &&
                    [...Array(5)].map((_, i) => (

                        <div
                            key={i}
                            className="flex gap-4 bg-white rounded-2xl p-4 border border-gray-200 animate-pulse"
                        >

                            <div className="w-24 h-24 bg-gray-200 rounded-xl" />

                            <div className="flex-1 space-y-2">

                                <div className="h-4 w-1/3 bg-gray-200 rounded" />

                                <div className="h-3 w-2/3 bg-gray-200 rounded" />

                                <div className="h-3 w-1/2 bg-gray-200 rounded" />

                            </div>

                        </div>

                    ))}

                {!loading &&
                    locations.map(loc => (

                        <div
                            key={loc.id}
                            className="relative flex gap-4 bg-white rounded-2xl p-4 border border-violet-100
            hover:shadow-md hover:border-violet-200 transition"
                        >

                            {/* IMAGE */}
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100">

                                <Image
                                    src={
                                        loc.coverImage?.[0] ??
                                        'https://i.pinimg.com/736x/36/21/a9/3621a941262c3977faff6f9a47943eee.jpg'
                                    }
                                    alt={loc.name}
                                    fill
                                    className="object-cover"
                                />

                            </div>

                            <div className="flex-1 pr-10">

                                <Link href={`/admin/venue-management/location/${loc.id}`}>
                                    <h3 className="font-semibold text-lg text-gray-900">
                                        {loc.name}
                                    </h3>
                                </Link>

                                <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-10">
                                    {loc.description ?? 'Không có mô tả'}
                                </p>

                                <p className="text-sm text-gray-900 font-medium italic mt-1 line-clamp-2 min-h-10">
                                    {loc.address ?? 'Chưa có địa chỉ'}
                                </p>

                            </div>

                            <Link
                                href={`/admin/venue-management/location/${loc.id}`}
                                className="absolute bottom-4 right-4"
                            >

                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600 hover:bg-violet-200">

                                    <ChevronRight size={18} />

                                </div>

                            </Link>

                        </div>

                    ))}

                {!loading && locations.length === 0 && (
                    <div className="text-center text-gray-500 py-10">
                        Không có yêu cầu nào
                    </div>
                )}

                {!loading && totalPages > 1 && (

                    <div className="flex justify-center items-center gap-4 pt-6">

                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-2 rounded-lg border disabled:opacity-40"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <span className="text-sm text-gray-600">
                            Page {page} / {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="p-2 rounded-lg border disabled:opacity-40"
                        >
                            <ChevronRight size={18} />
                        </button>

                    </div>

                )}

            </div>

            <div className="w-[320px] space-y-2 sticky top-8 self-start">

                <div className="flex items-center gap-3 bg-white border border-[#8093F1] rounded-3xl px-4 py-3 mb-4">

                    <Search className="text-[#8093F1] w-5 h-5" />

                    <input
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        placeholder="Tìm kiếm"
                        className="w-full bg-transparent outline-none text-sm"
                    />

                </div>

                {[
                    { key: 'all', label: 'Tất cả', value: stats.all },
                    { key: 'PENDING', label: 'Chờ duyệt', value: stats.PENDING },
                    { key: 'APPROVED', label: 'Đã duyệt', value: stats.APPROVED },
                    { key: 'REJECTED', label: 'Từ chối', value: stats.REJECTED },
                ].map(item => (

                    <div
                        key={item.key}
                        onClick={() => setStatusFilter(item.key as StatusFilter)}
                        className={`cursor-pointer rounded-[20px] p-3 transition
            ${statusFilter === item.key
                                ? 'bg-[#d2c7ff]'
                                : 'bg-[#F8EAFB] hover:bg-[#F3ECFF]'
                            }`}
                    >

                        <p className="text-sm text-gray-500">
                            {item.label}
                        </p>

                        <p className="text-2xl font-bold text-[#5B3DF5]">
                            {item.value.toString().padStart(2, '0')}
                        </p>

                    </div>

                ))}

            </div>

        </div>
    );
}