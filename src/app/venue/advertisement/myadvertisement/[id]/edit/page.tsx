"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getAdvertisementById,
  updateAdvertisementDraft,
} from "@/api/venue/advertisement/api";
import AdvertisementForm from "@/app/venue/advertisement/component/AdvertisementForm";

export default function EditAdvertisementPage() {

  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAdvertisementById(Number(id));
      setData(res.data);
    };

    fetchData();
  }, [id]);

  const handleUpdate = async (formData: any) => {
    await updateAdvertisementDraft(Number(id), formData);

    alert("Cập nhật thành công");

    router.push("/venue/advertisement");
  };

  if (!data) return <p>Loading...</p>;

  return (
    <AdvertisementForm
      initialData={data}
      onSubmit={handleUpdate}
      submitLabel="Cập nhật quảng cáo"
    />
  );
}