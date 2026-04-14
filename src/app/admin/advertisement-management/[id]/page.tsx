"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAdvertisementDetail } from "@/api/admin/api";
import AdsDetailPage from "./components/AdsDetailPage";
import { AdvertisementDetail } from "@/api/admin/type";

export default function AdvertisementDetailContainer() {
  const params = useParams();
  const id = Number(params.id);

  const [data, setData] = useState<AdvertisementDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await getAdvertisementDetail(id);
        setData(res.data as AdvertisementDetail);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="p-6">Đang tải...</p>;
  if (!data) return <p className="p-6">Không tìm thấy dữ liệu</p>;

  return <AdsDetailPage data={data} />;
}