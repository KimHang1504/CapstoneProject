"use client";

import { useRouter } from "next/navigation";
import VoucherForm from "../component/VoucherForm";
import { createVoucher } from "@/api/venue/vouchers/api";

export default function CreateVoucherPage() {

  const router = useRouter();
  const handleCreate = async (data: any) => {

    const res = await createVoucher(data);
    const voucherId = res.data.id;

    alert("Voucher created");
    router.push(`/venue/voucher/${voucherId}`);
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-xl font-semibold mb-4">
        Create Voucher
      </h1>

      <VoucherForm onSubmit={handleCreate} />
    </div>
  );
}