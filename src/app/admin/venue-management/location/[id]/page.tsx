import {
    MapPin,
    FileText,
    User,
    AlertTriangle,
    Tag,
    Info,
    Sparkles,
    HeartHandshake,
    Phone,
    Mail,
    Globe,
    CircleDollarSign,
    Text,
} from "lucide-react";

import { getAllPendingVenues, getPendingVenueDetail } from "@/api/admin/api";
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
    let listLocationTags = data.locationTags ?? [];

    try {
        const searchKeyword = venue?.name ?? String(id);
        const listRes = await getAllPendingVenues(1, 100, undefined, searchKeyword);
        const matchedItem = listRes.data.items.find((item) => item.id === id);
        listLocationTags = matchedItem?.locationTags ?? [];
    } catch {
        listLocationTags = [];
    }

    const sourceLocationTags = venue?.locationTags?.length
        ? venue.locationTags
        : (data.locationTags?.length ? data.locationTags : listLocationTags);
    const moods = Array.from(
        new Map(
            sourceLocationTags
                .map((tag) => tag.coupleMoodType)
                .filter((m): m is NonNullable<typeof m> => Boolean(m))
                .map((m) => [m.id, m])
        ).values()
    );
    const personalities = Array.from(
        new Map(
            sourceLocationTags
                .map((tag) => tag.couplePersonalityType)
                .filter((p): p is NonNullable<typeof p> => Boolean(p))
                .map((p) => [p.id, p])
        ).values()
    );
    const moodFallback = venue?.coupleMoodTypes ?? [];
    const personalityFallback = venue?.couplePersonalityTypes ?? [];
    const finalMoods = moods.length > 0 ? moods : moodFallback;
    const finalPersonalities = personalities.length > 0 ? personalities : personalityFallback;

    const isInactive = data.status === "INACTIVE";
    console.log("VenueDetailPage render with data:", data);

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
                        <section className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                            <div className="flex items-center gap-2">
                                <Tag size={16} className="text-violet-500" />
                                <h2 className="text-sm font-semibold text-gray-800">
                                    Mood & Personality
                                </h2>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                                    <Sparkles size={14} className="text-sky-500" />
                                    Mood
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {finalMoods.length > 0 ? (
                                        finalMoods.map((m) => (
                                            <div key={m.id} className="group relative inline-block">
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 text-sky-700 px-3 py-1 text-xs font-medium border border-sky-200">
                                                    {m.name}
                                                    <Info size={12} className="opacity-80" />
                                                </span>

                                                <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                                                    {m.description || "Chưa có mô tả cho mood này"}
                                                    <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-xs text-gray-400">Chưa có Mood</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                                    <HeartHandshake size={14} className="text-fuchsia-500" />
                                    Personality
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {finalPersonalities.length > 0 ? (
                                        finalPersonalities.map((p) => (
                                            <div key={p.id} className="group relative inline-block">
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-100 text-fuchsia-700 px-3 py-1 text-xs font-medium border border-fuchsia-200">
                                                    {p.name}
                                                    <Info size={12} className="opacity-80" />
                                                </span>

                                                <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                                                    {p.description || "Chưa có mô tả cho personality này"}
                                                    <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-xs text-gray-400">Chưa có Personality</span>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* INFO */}
                        <section className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                            <h2 className="text-sm font-semibold text-gray-800 mb-3">
                                Thông tin chi tiết
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 flex items-start gap-2">
                                    <CircleDollarSign size={16} className="text-emerald-600 mt-0.5" />
                                    <div className="text-sm text-gray-700">
                                        <p className="text-xs text-gray-500">Khoảng giá</p>
                                        <p>
                                            {venue.priceMin != null && venue.priceMax != null && venue.priceMin > 0 && venue.priceMax > 0
                                                ? `${venue.priceMin.toLocaleString('vi-VN')} - ${venue.priceMax.toLocaleString('vi-VN')} đ`
                                                : "Chưa cập nhật"}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 flex items-start gap-2">
                                    <Phone size={16} className="text-blue-600 mt-0.5" />
                                    <div className="text-sm text-gray-700">
                                        <p className="text-xs text-gray-500">Số điện thoại</p>
                                        <p>{venue.phoneNumber || "—"}</p>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 flex items-start gap-2">
                                    <Mail size={16} className="text-indigo-600 mt-0.5" />
                                    <div className="text-sm text-gray-700">
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p>{venue.email || "—"}</p>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 flex items-start gap-2">
                                    <Globe size={16} className="text-purple-600 mt-0.5" />
                                    <div className="text-sm text-gray-700">
                                        <p className="text-xs text-gray-500">Website</p>
                                        <p className="break-all">{venue.websiteUrl || "—"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white px-3 py-3 flex items-start gap-2">
                                <Text size={16} className="text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Mô tả</p>
                                    <p className="text-sm text-gray-700 leading-relaxed">{venue.description || "Không có mô tả"}</p>
                                </div>
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
                                Ảnh nội thất
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