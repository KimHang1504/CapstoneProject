"use client";

import { useEffect, useState, useMemo } from "react";

import { useRouter } from "next/navigation";
import { AdvertisementListItem } from "@/api/venue/advertisement/type";
import { getAdvertisements } from "@/api/venue/advertisement/api";
import AdvertisementCard from "@/app/venue/advertisement/component/AdvertisementCard";
import AdvertisementStats from "@/app/venue/advertisement/component/AdvertisementStats";
import AdvertisementFilterBar from "@/app/venue/advertisement/component/AdvertisementFilterBar";

export default function AdvertisementPage() {
  const router = useRouter();
  const [ads, setAds] = useState<AdvertisementListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await getAdvertisements();
        setAds(res.data);
        console.log(res); // full ApiResponse
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  const total = ads.length;
  const active = ads.filter(ad => ad.status === "ACTIVE").length;
  const pending = ads.filter(ad => ad.status === "PENDING").length;

  const draft = ads.filter(ad => ad.status === "DRAFT").length;
  const [activePlacement, setActivePlacement] = useState("ALL");

  const filteredAds = useMemo(() => {
    const result = ads
      .filter((ad) => status === "ALL" || ad.status === status)
      .filter((ad) =>
        ad.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter(
        (ad) =>
          activePlacement === "ALL" ||
          ad.placementType === activePlacement
      );

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sort === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [ads, search, status, activePlacement, sort]);

  const placements = [
    { label: "Tất cả", value: "ALL" },
    { label: "Banner đầu trang", value: "HOME_BANNER" },
    { label: "Popup", value: "POPUP" },
  ];

  const countByPlacement = (placement: string) => {
    if (placement === "ALL") return ads.length;

    return ads.filter((ad) => ad.placementType === placement).length;
  };


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Quản lý quảng cáo
        </h1>

        <button
          onClick={() => router.push("/venue/advertisement/myadvertisement/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Tạo mới
        </button>
      </div>
      <AdvertisementStats
        total={total}
        active={active}
        pending={pending}
        draft={draft}
      />
      <AdvertisementFilterBar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
      />
      <div className="flex gap-6 border-b border-gray-300 mb-4">
        {placements.map((p) => (
          <button
            key={p.value}
            onClick={() => setActivePlacement(p.value)}
            className={`pb-2 ${activePlacement === p.value
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-gray-500"
              }`}
          >
            {p.label} ({countByPlacement(p.value)})
          </button>
        ))}
      </div>
      {loading ? (
        <p>Đang tải...</p>
      ) : (

        <div className="grid grid-cols-4 gap-6">
          {filteredAds.map((ad) => (
            <AdvertisementCard key={ad.id} ad={ad} />
          ))}
        </div>

      )}

    </div>
  );
}