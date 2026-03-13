import { getPendingVenueDetail } from "@/api/admin/api";
import VenueApprovalActions from "./components/venueApprovalActions";
import Image from "next/image";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function LocationDetailPage({ params }: Props) {
    const { id } = await params;
    const res = await getPendingVenueDetail(id);
    const location = res.data;

    const coverImage =
        location.coverImage?.[0] ??
        null;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">

            <div className="relative">
                {coverImage != null ? (
                    <div className="relative w-full h-80 rounded-xl overflow-hidden shrink-0 bg-gray-100">

                        <Image
                            src={coverImage}
                            alt={location.name}
                            fill
                            className="object-cover"
                        />

                    </div>
                ) : (
                    <div className="text-gray-400">Không có hình ảnh</div>
                )}

                {location.isOwnerVerified ? (
                    <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                        Đã xác thực
                    </div>
                ) : (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                        Chưa xác thực
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    {location.name ?? "Unnamed Location"}
                </h1>

                <p className="text-gray-500 mt-1">
                    {location.address ?? "Chưa cập nhật địa chỉ"}
                </p>

                <div className="flex gap-6 mt-3 text-sm text-gray-600">
                    <span>⭐ {location.averageRating ?? 0}</span>

                    <span>{location.reviewCount ?? 0} reviews</span>

                    <span>
                        {location.priceMin
                            ? location.priceMin.toLocaleString()
                            : "-"}{" "}
                        -{" "}
                        {location.priceMax
                            ? location.priceMax.toLocaleString()
                            : "-"}{" "}
                        VND
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-3">Mô tả</h2>

                <p className="text-gray-700">
                    {location.description ?? "Chưa có mô tả"}
                </p>
            </div>

            {(location.coupleMoodTypes?.length ||
                location.couplePersonalityTypes?.length) && (
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Mood và tính cách phù hợp
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            {location.coupleMoodTypes?.map((tag: any) => (
                                <span
                                    key={tag.id}
                                    className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm"
                                >
                                    {tag.name}
                                </span>
                            ))}

                            {location.couplePersonalityTypes?.map((tag: any) => (
                                <span
                                    key={tag.id}
                                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

            {location.interiorImage?.length > 0 && (
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Hình ảnh nội thất
                    </h2>

                    <div className="grid grid-cols-3 gap-4">
                        {location.interiorImage.map(
                            (img: string, index: number) => (
                                <Image
                                key={index}  
                                    src={img}
                                    alt="Hình bị lỗi"
                                    width={400}
                                    height={300}
                                    className="object-cover w-full h-full"
                                    priority
                                />
                            )
                        )}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Chủ địa điểm</h2>

                <div className="grid grid-cols-2 gap-4 text-gray-700">

                    <div>
                        <p className="text-sm text-gray-500">
                            Tên doanh nghiệp
                        </p>
                        <p>
                            {location.venueOwner?.businessName ??
                                "Chưa cập nhật"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p>
                            {location.venueOwner?.phoneNumber ??
                                "Chưa cập nhật"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p>
                            {location.venueOwner?.email ??
                                "Chưa cập nhật"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Địa chỉ</p>
                        <p>
                            {location.venueOwner?.address ??
                                "Chưa cập nhật"}
                        </p>
                    </div>

                </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Liên hệ</h2>

                <div className="grid grid-cols-2 gap-4 text-gray-700">

                    <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p>{location.phoneNumber ?? "Chưa cập nhật"}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p>{location.email ?? "Chưa cập nhật"}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <p>
                            {location.websiteUrl ? (
                                <a
                                    href={`https://${location.websiteUrl}`}
                                    target="_blank"
                                    className="text-blue-600 underline"
                                >
                                    {location.websiteUrl}
                                </a>
                            ) : (
                                "Chưa cập nhật"
                            )}
                        </p>
                    </div>

                </div>
            </div>
            <VenueApprovalActions id={id} />
        </div>
    );
}