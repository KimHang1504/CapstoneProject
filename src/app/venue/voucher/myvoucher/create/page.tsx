"use client";

import { useRouter } from "next/navigation";
import VoucherForm from "../../component/VoucherForm";
import { createVoucher } from "@/api/venue/vouchers/api";
import {toast} from "sonner";

export default function CreateVoucherPage() {

  const router = useRouter();
  const handleCreate = async (data: any) => {

    const res = await createVoucher(data);
    const voucherId = res.data.id;

    toast.success("Voucher created");
    router.push(`/venue/voucher/${voucherId}`);
  };

  return (
    <div className="">
      <VoucherForm onSubmit={handleCreate} />
    </div>
  );
}