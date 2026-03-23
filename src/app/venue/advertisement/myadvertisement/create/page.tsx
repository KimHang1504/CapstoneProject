"use client";
import { createAdvertisement } from "@/api/venue/advertisement/api";
import AdvertisementForm from "@/app/venue/advertisement/component/AdvertisementForm";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CreateAdvertisementPage() {

  const router = useRouter();

  const handleCreate = async (data: any) => {
    await createAdvertisement(data);
toast.success("Tạo quảng cáo thành công!");
    router.push("/venue/advertisement");
  };

  return (
    <AdvertisementForm
      onSubmit={handleCreate}
      submitLabel="Tạo quảng cáo"
    />
  );
}