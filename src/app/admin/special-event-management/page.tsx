'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, ChevronLeft, Search, Trash2, IdCard } from 'lucide-react';
import Image from 'next/image';
import { deleteSpecialEvent, getAllSpecialEvents } from '@/api/admin/api';
import { SpecialEvent } from '@/api/admin/type';
import Link from 'next/link';

export default function SpecialEventListPage() {

    const [keyword, setKeyword] = useState('');
    const [data, setData] = useState<SpecialEvent[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {

        setLoading(true);

        getAllSpecialEvents(page, 10)
            .then(res => {

                setData(res.data.items);
                setTotalPages(res.data.totalPages);

            })
            .finally(() => setLoading(false));

    }, [page]);

    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc muốn xóa sự kiện này không?')) {
            await deleteSpecialEvent(id);
            getAllSpecialEvents(page, 10).then(res => {
                setData(res.data.items);
                setTotalPages(res.data.totalPages);
            });
        }
    };

    const events = useMemo(() => {

        const key = keyword.toLowerCase();

        return data.filter(e =>
            e.eventName.toLowerCase().includes(key)
        );

    }, [data, keyword]);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('vi-VN');
    };

    return (
        <div className="flex gap-10 p-8 items-start">

            {/* LEFT LIST */}
            <div className="flex-1 min-w-0 space-y-4">

                {loading &&
                    [...Array(5)].map((_, i) => (

                        <div
                            key={i}
                            className="flex gap-4 bg-white rounded-2xl p-4 border border-gray-200 animate-pulse"
                        >

                            <div className="w-32 h-24 bg-gray-200 rounded-xl" />

                            <div className="flex-1 space-y-2">

                                <div className="h-4 w-1/3 bg-gray-200 rounded" />

                                <div className="h-3 w-2/3 bg-gray-200 rounded" />

                                <div className="h-3 w-1/2 bg-gray-200 rounded" />

                            </div>

                        </div>

                    ))}

                {!loading &&
                    events.map(event => (

                        <div
                            key={event.id}
                            className="relative flex gap-4 bg-white rounded-2xl p-4 border border-violet-100
            hover:shadow-md hover:border-violet-200 transition"
                        >

                            {/* IMAGE */}
                            <div className="relative w-32 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                                {event.imageUrl ?
                                    <Image
                                        src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNQXHua5bQYZmQ9fyqedecWJPXFL7UMH-9Nw&s'
                                        alt={event.eventName}
                                        fill
                                        className="object-cover"
                                    />
                                    :
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                }

                            </div>

                            {/* CONTENT */}
                            <div className="flex-1 pr-10">
                                <Link href={`/admin/special-event-management/special-event/${event.id}`}>
                                    <h3 className="font-semibold text-lg text-gray-900">
                                        {event.eventName}
                                    </h3>
                                </Link>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {event.description}
                                </p>

                                <p className="text-sm text-violet-600 font-medium mt-2">
                                    {formatDate(event.startDate)} → {formatDate(event.endDate)}
                                </p>

                            </div>

                            {/* ARROW */}
                            <Link href={`/admin/special-event-management/special-event/${event.id}`}>
                                <div className="absolute bottom-4 right-4">

                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600">

                                        <ChevronRight size={18} />

                                    </div>

                                </div>
                            </Link>

                            <div className="absolute top-4 right-4">

                                <button
                                    className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-full text-red-500"
                                    onClick={() => handleDelete(event.id)}
                                >

                                    <Trash2 size={18} />
                                </button>
                        </div>

                        </div>

                    ))}

            {!loading && events.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                    Không có sự kiện
                </div>
            )}

            {/* PAGINATION */}
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


            {/* RIGHT PANEL */ }
    <div className="w-[320px] space-y-2 sticky top-8 self-start">

        {/* SEARCH */}
        <div className="flex items-center gap-3 bg-white border border-[#8093F1] rounded-3xl px-4 py-3 mb-4">

            <Search className="text-[#8093F1] w-5 h-5" />

            <input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Tìm kiếm sự kiện"
                className="w-full bg-transparent outline-none text-sm"
            />

        </div>

        {/* STAT */}
        <div className="rounded-[20px] p-3 bg-[#F8EAFB]">

            <p className="text-sm text-gray-500">
                Tổng sự kiện
            </p>

            <p className="text-2xl font-bold text-[#5B3DF5]">
                {data.length.toString().padStart(2, '0')}
            </p>

        </div>

    </div>

        </div >
    );
}