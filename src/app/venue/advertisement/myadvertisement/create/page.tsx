"use client";

import { useEffect, useState } from "react";
import { createAdvertisement} from "@/api/venue/advertisement/api";
import AdvertisementForm from "@/app/venue/advertisement/component/AdvertisementForm";
import { useRouter } from "next/navigation";
import {toast} from "sonner";
import { getMoodTypes } from "@/api/mood/api";

type MoodOption = {
  id: number;
  name: string;
};

export default function CreateAdvertisementPage() {
  const router = useRouter();
  const [moodOptions, setMoodOptions] = useState<MoodOption[]>([]);
  const [loadingMoods, setLoadingMoods] = useState(true);

  useEffect(() => {
    const fetchMoodTypes = async () => {
      try {
        const res = await getMoodTypes();

        setMoodOptions(
          (res.data ?? []).map((item: any) => ({
            id: item.id,
            name: item.name,
          }))
        );
      } catch (error) {
        console.error("Get mood types error:", error);
        toast.error("Không tải được danh sách mood");
      } finally {
        setLoadingMoods(false);
      }
    };

    fetchMoodTypes();
  }, []);

  const handleCreate = async (data: any) => {
    await createAdvertisement(data);
    toast.success("Tạo quảng cáo thành công!");
    router.push("/venue/advertisement");
  };

  if (loadingMoods) return <p>Loading...</p>;

  return (
    <AdvertisementForm
      onSubmit={handleCreate}
      submitLabel="Tạo quảng cáo"
      moodOptions={moodOptions}
    />
  );
}