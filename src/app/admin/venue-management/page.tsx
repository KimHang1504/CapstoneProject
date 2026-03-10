'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';
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

    useEffect(() => {

        getAllPendingVenues()
            .then(res => {

                setData(res.data.items);

            })
            .finally(() => setLoading(false));

    }, []);

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

    if (loading) {
        return <div className="p-8 text-gray-500">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="flex gap-10 p-8 items-start">

            {/* LEFT LIST */}
            <div className="flex-1 min-w-0 space-y-4">

                {locations.map(loc => (

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

                        {/* CONTENT */}
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

                        {/* ARROW */}
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

                {locations.length === 0 && (
                    <div className="text-center text-gray-500 py-10">
                        Không có yêu cầu nào 
                    </div>
                )}

            </div>


            {/* RIGHT PANEL */}
            <div className="w-[320px] space-y-2 sticky top-8 self-start">

                {/* SEARCH */}
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