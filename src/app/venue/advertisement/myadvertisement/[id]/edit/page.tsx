"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getAdvertisementById,
  updateAdvertisementDraft,
} from "@/api/venue/advertisement/api";
import AdvertisementForm from "@/app/venue/advertisement/component/AdvertisementForm";
import {toast} from "sonner";
import { getMoodTypes } from "@/api/mood/api";

type MoodOption = {
  id: number;
  name: string;
};

export default function EditAdvertisementPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [moodOptions, setMoodOptions] = useState<MoodOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [advertisementRes, moodTypesRes] = await Promise.all([
          getAdvertisementById(Number(id)),
          getMoodTypes(),
        ]);

        setData(advertisementRes.data);
        setMoodOptions(
          (moodTypesRes.data ?? []).map((item: any) => ({
            id: item.id,
            name: item.name,
          }))
        );
      } catch (error) {
        console.error("Fetch advertisement detail error:", error);
        toast.error("Không tải được dữ liệu quảng cáo");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleUpdate = async (formData: any) => {
    await updateAdvertisementDraft(Number(id), formData);
    toast.success("Cập nhật thành công");
    router.push(`/venue/advertisement/myadvertisement/${id}`);
  };

  if (loading || !data) return <p>Loading...</p>;

  return (
    <AdvertisementForm
      initialData={data}
      onSubmit={handleUpdate}
      submitLabel="Cập nhật quảng cáo"
      moodOptions={moodOptions}
    />
  );
}