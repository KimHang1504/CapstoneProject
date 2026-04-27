"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AdvertisementListItem } from "@/api/venue/advertisement/type";
import { getAdvertisements } from "@/api/venue/advertisement/api";
import AdvertisementCard from "@/app/venue/advertisement/component/AdvertisementCard";
import AdvertisementStats from "@/app/venue/advertisement/component/AdvertisementStats";
import AdvertisementFilterBar from "@/app/venue/advertisement/component/AdvertisementFilterBar";

import AdvertisementCardSkeleton from "@/components/skeleton/AdvertisementCardSkeleton";
import StatsSkeleton from "@/components/skeleton/StatsSkeleton";
import FilterSkeleton from "@/components/skeleton/FilterSkeleton";
import HeaderSkeleton from "@/components/skeleton/HeaderSkeleton";
import TabsSkeleton from "@/components/skeleton/TabsSkeleton";

const placements = [
  { label: "Tất cả", value: "ALL" },
  { label: "Banner đầu trang", value: "HOME_BANNER" },
  { label: "Popup", value: "POPUP" },
];

export default function AdvertisementPage() {
  const router = useRouter();

  const [ads, setAds] = useState<AdvertisementListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState("newest");
  const [activePlacement, setActivePlacement] = useState("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await getAdvertisements();
        setAds(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  const total = ads.length;
  const approved = ads.filter((ad) => ad.status === "APPROVED").length;
  const pending = ads.filter((ad) => ad.status === "PENDING").length;
  const draft = ads.filter((ad) => ad.status === "DRAFT").length;
  const rejected = ads.filter((ad) => ad.status === "REJECTED").length;
console.log ("rejected ads", rejected);

  const filteredAds = useMemo(() => {
    return ads
      .filter((ad) => status === "ALL" || ad.status === status)
      .filter((ad) =>
        ad.title.toLowerCase().includes(searchKeyword.toLowerCase())
      )
      .filter(
        (ad) =>
          activePlacement === "ALL" ||
          ad.placementType === activePlacement
      )
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sort === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [ads, searchKeyword, status, activePlacement, sort]);

  const countByPlacement = (placement: string) =>
    placement === "ALL"
      ? ads.length
      : ads.filter((ad) => ad.placementType === placement).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-pink-50 p-6">

      {loading ? (
        <>
          <HeaderSkeleton />
          <StatsSkeleton />
          <FilterSkeleton />
          <TabsSkeleton />

          <div className="grid grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <AdvertisementCardSkeleton key={i} />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Quản lý quảng cáo
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Theo dõi và quản lý tất cả chiến dịch quảng cáo của bạn
              </p>
            </div>
            <button
              onClick={() =>
                router.push(
                  "/venue/advertisement/myadvertisement/create"
                )
              }
              className="bg-linear-to-r from-violet-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium"
            >
              + Tạo mới
            </button>
          </div>

          {/* Stats */}
          <AdvertisementStats
            total={total}
            approved={approved}
            pending={pending}
            draft={draft}
            rejected={rejected}
          />

          {/* Filter */}
          <AdvertisementFilterBar
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            status={status}
            setStatus={setStatus}
            sort={sort}
            setSort={setSort}
          />

          {/* Tabs */}
          <div className="relative mb-6 border-b border-gray-200">
            <div className="flex gap-4">
              {placements.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setActivePlacement(p.value)}
                  className={`px-4 py-2 text-sm ${activePlacement === p.value
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500"
                    }`}
                >
                  {p.label} ({countByPlacement(p.value)})
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filteredAds.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-gray-400">
              <span className="text-5xl mb-4">📭</span>
              <p className="text-lg">Không có quảng cáo nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              {filteredAds.map((ad) => (
                <AdvertisementCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}