import { getSpecialEventDetail } from "@/api/admin/api";
import Image from "next/image";
import { Calendar, Info } from "lucide-react";
import BackButton from "@/components/BackButton";
import Link from "next/link";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EventDetailPage({ params }: Props) {

    const { id } = await params;

    const res = await getSpecialEventDetail(id);

    const event = res.data;

    const banner = event.bannerUrl ?? null;

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('vi-VN', {
            month: '2-digit',
            day: '2-digit',
            ...(event.isYearly ? {} : { year: "numeric" }),
        });

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <div className="flex justify-between">
                <BackButton />
                <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    <Link href={`/admin/special-event-management/special-event/${id}/edit`}>
                        Chỉnh sửa
                    </Link>
                </button>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow">

                <div className="relative w-full h-80 bg-gray-100 flex items-center justify-center">

                    {banner ? (
                        <Image
                            src={banner}
                            alt={event.eventName}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="text-gray-400">Không có hình ảnh</div>
                    )}

                    <div className="absolute inset-0 bg-black/20" />

                </div>

                <div className="absolute top-4 left-4 bg-violet-600 text-white text-xs px-3 py-1 rounded-full shadow">
                    Sự kiện đặc biệt
                </div>

            </div>


            <div className="bg-white rounded-xl shadow p-6 space-y-4">

                <h1 className="text-3xl font-bold text-gray-800">
                    {event.eventName}
                </h1>

                <div className="flex items-center gap-3 text-gray-600 text-sm">

                    <Calendar size={18} />

                    <span>
                        {formatDate(event.startDate)} → {formatDate(event.endDate)} {event.isYearly && "(Hàng năm)"}
                    </span>

                </div>

            </div>


            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Info size={18} />
                    Mô tả sự kiện
                </h2>

                <p className="text-gray-700 leading-relaxed">
                    {event.description ?? "Chưa có mô tả"}
                </p>

            </div>


            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-semibold mb-4">
                    Thông tin sự kiện
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">

                    <div className="bg-gray-50 rounded-lg p-4">

                        <p className="text-sm text-gray-500">
                            Ngày bắt đầu
                        </p>

                        <p className="font-medium text-gray-800 mt-1">
                            {formatDate(event.startDate)}
                        </p>

                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">

                        <p className="text-sm text-gray-500">
                            Ngày kết thúc
                        </p>

                        <p className="font-medium text-gray-800 mt-1">
                            {formatDate(event.endDate)}
                        </p>

                    </div>

                </div>

            </div>

        </div >
    );
}