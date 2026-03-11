import { getPendingVenueDetail } from "@/api/admin/api";
import VenueApprovalActions from "./components/venueApprovalActions";

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
        "https://via.placeholder.com/1200x400?text=No+Image";

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">

            {/* COVER */}
            <div className="relative">
                <img
                    src={coverImage}
                    className="w-full max-h-80 object-contain rounded-xl"
                />

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

            {/* HEADER */}
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

            {/* DESCRIPTION */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>

                <p className="text-gray-700">
                    {location.description ?? "Chưa có mô tả"}
                </p>
            </div>

            {/* TAGS */}
            {(location.coupleMoodTypes?.length ||
                location.couplePersonalityTypes?.length) && (
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Mood & Personality
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

            {/* GALLERY */}
            {location.interiorImage?.length > 0 && (
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Interior Images
                    </h2>

                    <div className="grid grid-cols-3 gap-4">
                        {location.interiorImage.map(
                            (img: string, index: number) => (
                                <img
                                    key={index}
                                    src={img}
                                    className="w-full h-50 object-cover rounded-lg"
                                />
                            )
                        )}
                    </div>
                </div>
            )}

            {/* OWNER INFO */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Venue Owner</h2>

                <div className="grid grid-cols-2 gap-4 text-gray-700">

                    <div>
                        <p className="text-sm text-gray-500">
                            Business Name
                        </p>
                        <p>
                            {location.venueOwner?.businessName ??
                                "Chưa cập nhật"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Phone</p>
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
                        <p className="text-sm text-gray-500">Address</p>
                        <p>
                            {location.venueOwner?.address ??
                                "Chưa cập nhật"}
                        </p>
                    </div>

                </div>
            </div>

            {/* CONTACT */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Contact</h2>

                <div className="grid grid-cols-2 gap-4 text-gray-700">

                    <div>
                        <p className="text-sm text-gray-500">Phone</p>
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