"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AdvertisementListItem } from "@/api/venue/advertisement/type";
import { getAdvertisements } from "@/api/venue/advertisement/api";
import AdvertisementCard from "@/app/venue/advertisement/component/AdvertisementCard";
import AdvertisementStats from "@/app/venue/advertisement/component/AdvertisementStats";
import AdvertisementFilterBar from "@/app/venue/advertisement/component/AdvertisementFilterBar";

const placements = [
  { label: "Tất cả", value: "ALL" },
  { label: "Banner đầu trang", value: "HOME_BANNER" },
  { label: "Popup", value: "POPUP" },
];

export default function AdvertisementPage() {
  console.log("AdvertisementPage render");
  const router = useRouter();
  const [ads, setAds] = useState<AdvertisementListItem[]>([]);
  const [loading, setLoading] = useState(true);
  // const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState("newest");
  const [activePlacement, setActivePlacement] = useState("ALL");

  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await getAdvertisements();
        setAds(res.data);
        console.log(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  const total = ads.length;
  const active = ads.filter((ad) => ad.status === "ACTIVE").length;
  const pending = ads.filter((ad) => ad.status === "PENDING").length;
  const draft = ads.filter((ad) => ad.status === "DRAFT").length;

  const filteredAds = useMemo(() => {
    return ads
      .filter((ad) => status === "ALL" || ad.status === status)
      .filter((ad) => ad.title.toLowerCase().includes(searchKeyword.toLowerCase()))
      .filter((ad) => activePlacement === "ALL" || ad.placementType === activePlacement)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sort === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [ads, searchKeyword, status, activePlacement, sort]);

  const countByPlacement = (placement: string) =>
    placement === "ALL" ? ads.length : ads.filter((ad) => ad.placementType === placement).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý quảng cáo</h1>
          <p className="text-sm text-gray-400 mt-1">Theo dõi và quản lý tất cả chiến dịch quảng cáo của bạn</p>
        </div>
        <button
          onClick={() => router.push("/venue/advertisement/myadvertisement/create")}
          className="bg-linear-to-r  cursor-pointer from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Tạo mới
        </button>
      </div>

      {/* Stats */}
      <AdvertisementStats total={total} active={active} pending={pending} draft={draft} />

      {/* Filter */}
      <AdvertisementFilterBar
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
      />

      {/* Placement tabs */}
      <div className="relative mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          {placements.map((p) => (
            <button
              key={p.value}
              onClick={() => setActivePlacement(p.value)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${activePlacement === p.value
                ? "text-purple-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {p.label} ({countByPlacement(p.value)})
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-violet-100" />
          ))}
        </div>
      ) : filteredAds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <span className="text-5xl mb-4">📭</span>
          <p className="text-lg font-medium">Không có quảng cáo nào</p>
          <p className="text-sm mt-1">Thử thay đổi bộ lọc hoặc tạo quảng cáo mới</p>
        </div>
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
