import {
    MapPin,
    FileText,
    User,
    AlertTriangle,
    Tag,
} from "lucide-react";

import { getPendingVenueDetail } from "@/api/admin/api";
import VenueApprovalActions from "./components/venueApprovalActions";
import ImagePreview from "./components/ImagePreview";
import BackButton from "@/components/BackButton";

type Props = {
    params: Promise<{ id: number }>;
};

export default async function VenueDetailPage({ params }: Props) {
    const { id } = await params;

    const res = await getPendingVenueDetail(id);
    const data = res.data;

    const venue = data.venue;
    const owner = data.venueOwner;

    const isInactive = data.status === "INACTIVE";

    if (!venue) {
        return (
            <div className="h-[60vh] flex items-center justify-center text-gray-400">
                Không có dữ liệu venue
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto p-6 space-y-6">
                <BackButton />

                {/* HEADER */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {venue.name}
                        </h1>

                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <MapPin size={14} />
                            {venue.address}
                        </p>
                    </div>

                    <span
                        className={`text-xs px-3 py-1 rounded-full font-medium
            ${data.status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : data.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                    >
                        {data.status === "ACTIVE" && "Đang hoạt động"}
                        {data.status === "PENDING" && "Đang chờ duyệt"}
                        {data.status === "INACTIVE" && "Đã bị hủy"}
                    </span>
                </div>

                {/* WARNING */}
                {isInactive && (
                    <div className="border border-red-200 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                        <AlertTriangle size={16} />
                        Venue đã bị dừng hoạt động – chỉ dùng để kiểm tra
                    </div>
                )}

                {/* MAIN */}
                <div className="grid grid-cols-12 gap-6">

                    {/* LEFT */}
                    <div className={`col-span-8 space-y-6 ${isInactive ? "opacity-60" : ""}`}>

                        {/* COVER HERO */}
                        {venue.coverImage && venue.coverImage.length > 0 && (
                            <section className="rounded-xl overflow-hidden border border-gray-200">
                                <ImagePreview
                                    src={venue.coverImage[0]}
                                    alt="Ảnh bìa"
                                    width={1200}
                                    height={320}
                                />
                            </section>
                        )}

                        {/* DOCUMENTS */}
                        <section className="bg-white border border-gray-200 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText size={16} className="text-red-500" />
                                <h2 className="text-sm font-semibold text-gray-800">
                                    Giấy tờ xác minh
                                </h2>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    {
                                        src: data.businessLicenseUrl,
                                        label: "Giấy phép kinh doanh",
                                    },
                                    {
                                        src: owner.citizenIdFrontUrl,
                                        label: "CCCD Mặt trước",
                                    },
                                    {
                                        src: owner.citizenIdBackUrl,
                                        label: "CCCD Mặt sau",
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="border border-gray-200 rounded-lg bg-gray-50 p-2"
                                    >
                                        <ImagePreview src={item.src} alt={item.label} />

                                        <p className="text-xs text-gray-500 mt-2 text-center">
                                            {item.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* MOOD */}
                        <section className="bg-white border border-gray-200 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Tag size={16} />
                                <h2 className="text-sm font-semibold text-gray-800">
                                    Mood & Personality
                                </h2>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {venue.coupleMoodTypes?.map((m) => (
                                    <span
                                        key={m.id}
                                        className="text-xs bg-gray-100 px-3 py-1 rounded-full"
                                    >
                                        {m.name}
                                    </span>
                                ))}
                                {venue.couplePersonalityTypes?.map((p) => (
                                    <span
                                        key={p.id}
                                        className="text-xs bg-gray-100 px-3 py-1 rounded-full"
                                    >
                                        {p.name}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* INFO */}
                        <section className="bg-white border border-gray-200 rounded-xl p-5">
                            <h2 className="text-sm font-semibold text-gray-800 mb-3">
                                Thông tin chi tiết
                            </h2>

                            <p className="text-sm text-gray-600 leading-relaxed">
                                {venue.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
                                <p>💰 {venue.priceMin} - {venue.priceMax}</p>
                                <p>📞 {venue.phoneNumber}</p>
                                <p>📧 {venue.email}</p>
                            </div>
                        </section>

                        {/* MENU */}
                        {venue.fullPageMenuImage && venue.fullPageMenuImage.length > 0 && (
                            <section className="bg-white border border-gray-200 rounded-xl p-5">
                                <h2 className="text-sm font-semibold text-gray-800 mb-4">
                                    Menu
                                </h2>

                                <div className="grid grid-cols-2 gap-4">
                                    {venue.fullPageMenuImage.map((img: string) => (
                                        <div
                                            key={img}
                                            className="border border-gray-200 rounded-lg bg-gray-50 p-2"
                                        >
                                            <ImagePreview src={img} alt="Menu Image" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* INTERIOR */}
                        <section className="bg-white border border-gray-200 rounded-xl p-5">
                            <h2 className="text-sm font-semibold text-gray-800 mb-4">
                                Interior
                            </h2>

                            <div className="grid grid-cols-3 gap-3">
                                {venue.interiorImage?.map((img: string) => (
                                    <div
                                        key={img}
                                        className="border border-gray-200 rounded-lg bg-gray-50 p-1"
                                    >
                                        <ImagePreview src={img} alt="Interior Image" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT */}
                    <div className="col-span-4">
                        <div className="sticky top-6 space-y-6">

                            {/* APPROVAL */}
                            <VenueApprovalActions id={id} status={data.status} />

                            {/* OWNER */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5">
                                <h2 className="text-sm font-semibold mb-3 text-gray-800 flex items-center gap-2">
                                    <User size={16} />
                                    Chủ địa điểm
                                </h2>

                                <p className="text-sm font-medium text-gray-900">
                                    {owner.businessName}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {owner.phoneNumber}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {owner.email}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}