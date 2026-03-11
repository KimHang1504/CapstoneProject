import { getSpecialEventDetail } from "@/api/admin/api";
import Image from "next/image";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EventDetailPage({ params }: Props) {

    const { id } = await params;

    const res = await getSpecialEventDetail(id);

    const event = res.data;

    const banner =
        event.imageUrl ??
        null;

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("vi-VN");

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">

            {/* BANNER */}
            <div className="relative">

                <div className="relative w-full h-80 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                    {banner != null ? (
                        <Image
                            src={banner}
                            alt={event.eventName}
                            fill
                            className="object-contain"
                        />
                    ) : (
                        <div className="text-gray-400">Không có hình ảnh</div>
                    )}

                </div>

                <div className="absolute top-4 left-4 bg-violet-600 text-white text-xs px-3 py-1 rounded-full">
                    Special Event
                </div>

            </div>

            {/* HEADER */}
            <div className="bg-white rounded-xl shadow p-6">

                <h1 className="text-3xl font-bold text-gray-800">
                    {event.eventName}
                </h1>

                <div className="flex gap-6 mt-4 text-sm text-gray-600">

                    <span>
                        📅 {formatDate(event.startDate)} → {formatDate(event.endDate)}
                    </span>

                </div>

            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-semibold mb-3">
                    Description
                </h2>

                <p className="text-gray-700 leading-relaxed">
                    {event.description ?? "Chưa có mô tả"}
                </p>

            </div>

            {/* METADATA */}
            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-semibold mb-4">
                    Event Information
                </h2>

                <div className="grid grid-cols-2 gap-4 text-gray-700">

                    <div>
                        <p className="text-sm text-gray-500">
                            Start Date
                        </p>
                        <p>
                            {formatDate(event.startDate)}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            End Date
                        </p>
                        <p>
                            {formatDate(event.endDate)}
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}