'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, ChevronLeft, Search, Trash2, IdCard, Plus } from 'lucide-react';
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
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="flex gap-10 px-8 py-4 items-start">
            <div className="flex-1 min-w-0 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quản lí sự kiện đặc biệt</h2>
                    <div className='flex item-center'>
                        <Link href="/admin/special-event-management/new"
                            className="inline-flex items-center gap-2 text-sm bg-violet-600 text-white px-4 py-2 rounded-full shadow hover:bg-violet-700 transition"
                        >
                            <Plus size={18} />
                            Tạo sự kiện mới
                        </Link>
                    </div>
                </div>
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

                            <div className="relative w-32 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                                {event.bannerUrl ?
                                    <Image
                                        src={event.bannerUrl}
                                        alt={event.eventName}
                                        fill
                                        className="object-cover"
                                    />
                                    :
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        Rỗng
                                    </div>
                                }

                            </div>

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
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl bg-gray-50 text-center">
                        <svg
                            className="w-10 h-10 text-gray-400 mb-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path d="M9 12l2 2 4-4" />
                            <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                        </svg>

                        <p className="text-gray-600 font-medium">
                            Không có sự kiện nào
                        </p>

                        <p className="text-sm text-gray-400">
                            Hãy tạo sự kiện nào
                        </p>
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
                        placeholder="Tìm kiếm sự kiện"
                        className="w-full bg-transparent outline-none text-sm"
                    />

                </div>

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