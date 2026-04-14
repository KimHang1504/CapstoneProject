"use client";

import { AdvertisementDetail } from "@/api/admin/type";
import Image from "next/image";
import { Badge } from "./Badge";
import { BasicInfoCard } from "./BasicInfoCard";
import { ContentCard } from "./ContentCard";
import { VenueCard } from "./VenueCard";
import { OrderCard } from "./OrderCard";
import { RejectionCard } from "./RejectionCard";
import { StatusCard } from "./StatusCard";

export default function AdsDetailPage({ data }: { data: AdvertisementDetail }) {
    return (
        <div className="p-6 space-y-6">
            {/* HEADER */}
            <h1 className="text-2xl font-bold">Chi tiết quảng cáo</h1>

            {/* HERO */}
            <div className="relative w-full h-65 rounded-2xl overflow-hidden shadow-md">
                <Image
                    src={data.bannerUrl}
                    alt="banner"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute bottom-4 left-4 text-white">
                    <h2 className="text-2xl font-bold">{data.title}</h2>
                    <div className="flex gap-2 mt-2">
                        <Badge label={data.moodTypeName} />
                        <Badge label={data.placementType} />
                    </div>
                </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-3 gap-6">
                {/* LEFT */}
                <div className="col-span-2 space-y-6">
                    <BasicInfoCard data={data} />
                    <ContentCard content={data.content} />
                    <VenueCard venues={data.venueLocationAds} />
                    <OrderCard orders={data.adsOrders} />
                    {data.rejectionHistory && <RejectionCard history={data.rejectionHistory} />}
                </div>

                {/* RIGHT - FIX */}
                <div className="col-span-1">
                    <div className="sticky top-6">
                        <StatusCard
                            status={data.status}
                            adId={data.id}
                            onSuccess={() => window.location.reload()}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}