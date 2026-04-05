import { getPendingVenueDetail } from "@/api/admin/api";
import VenueApprovalActions from "./components/venueApprovalActions";
import Image from "next/image";
import ImagePreview from "./components/ImagePreview";
import BackButton from "@/components/BackButton";

type Props = {
    params: Promise<{
        id: number;
    }>;
};

export default async function VenueDetailPage({ params }: Props) {
    const { id } = await params;

    const res = await getPendingVenueDetail(id);
    const venue = res.data;
    console.log('Venue detail:', venue);

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <BackButton />
            {/* HEADER */}
            <div className="bg-white rounded-xl shadow p-6 flex gap-6">

                <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-gray-100">

                    {venue.businessLicenseUrl ? (
                        <ImagePreview
                            src={venue.businessLicenseUrl}
                            alt="Business License"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            Không có ảnh
                        </div>
                    )}

                </div>

                <div className="flex-1">

                    <h1 className="text-3xl font-bold text-gray-800">
                        {venue.name}
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Trạng thái:
                        <span
                            className={`ml-2 px-3 py-1 rounded-full text-xs font-medium
              ${venue.status === "ACTIVE"
                                    ? "bg-green-100 text-green-700"
                                    : venue.status === "PENDING"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : venue.status === "INACTIVE"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            {venue.status}
                        </span>
                    </p>

                    {venue.websiteUrl && venue.websiteUrl !== "null" && (
                        <p className="mt-2 text-blue-600">
                            <a
                                href={`https://${venue.websiteUrl}`}
                                target="_blank"
                                className="underline"
                            >
                                {venue.websiteUrl}
                            </a>
                        </p>
                    )}

                </div>

            </div>

            {/* OWNER INFO */}
            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-semibold mb-4">
                    Thông tin chủ địa điểm
                </h2>

                <div className="grid grid-cols-2 gap-6 text-gray-700">

                    <div>
                        <p className="text-sm text-gray-500">Tên doanh nghiệp</p>
                        <p className="font-medium">
                            {venue.venueOwner?.businessName ?? "Chưa cập nhật"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p>
                            {venue.venueOwner?.phoneNumber ?? "Chưa cập nhật"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p>
                            {venue.venueOwner?.email ?? "Chưa cập nhật"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Địa chỉ</p>
                        <p>
                            {venue.venueOwner?.address ?? "Chưa cập nhật"}
                        </p>
                    </div>

                </div>

            </div>

            {/* CCCD */}
            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-semibold mb-4">
                    CCCD chủ doanh nghiệp
                </h2>

                <div className="grid grid-cols-2 gap-6">

                    <div className="space-y-2">
                        <p className="text-sm text-gray-500">Mặt trước</p>

                        {venue.venueOwner?.citizenIdFrontUrl ? (
                            <ImagePreview
                                src={venue.venueOwner.citizenIdFrontUrl}
                                alt="CCCD Front"
                            />
                        ) : (
                            <p className="text-gray-400 text-sm">
                                Không có hình
                            </p>
                        )}

                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-gray-500">Mặt sau</p>

                        {venue.venueOwner?.citizenIdBackUrl ? (
                            <ImagePreview
                                src={venue.venueOwner.citizenIdBackUrl}
                                alt="CCCD Back"
                            />
                        ) : (
                            <p className="text-gray-400 text-sm">
                                Không có hình
                            </p>
                        )}

                    </div>

                </div>

            </div>

            {/* APPROVAL - Show for PENDING and ACTIVE status */}
            {(venue.status === 'PENDING' || venue.status === 'ACTIVE') && (
                <VenueApprovalActions id={id} status={venue.status} />
            )}

        </div>
    );
}