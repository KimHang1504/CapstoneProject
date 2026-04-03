"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import VoucherForm from "@/app/venue/voucher/component/VoucherForm";

import {
  getVoucherDetail,
  updateVoucher
} from "@/api/venue/vouchers/api";

import { CreateVoucherRequest } from "@/api/venue/vouchers/type";
import {toast} from "sonner";

export default function EditVoucherPage() {

  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const [voucher, setVoucher] =
    useState<CreateVoucherRequest | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchVoucher = async () => {

      try {

        const res = await getVoucherDetail(id);
        const data = res.data;

        setVoucher({
          title: data.title,
          description: data.description ?? "",

          voucherPrice: data.voucherPrice,

          discountType: data.discountType,
          discountAmount: data.discountAmount,
          discountPercent: data.discountPercent,

          quantity: data.quantity,
          imageUrl: data.imageUrl ?? "",

          usageLimitPerMember: data.usageLimitPerMember,
          usageValiDays: data.usageValiDays ?? 7,

          venueLocationIds: data.locations.map(
            (l) => l.venueLocationId
          ),

          startDate: data.startDate.slice(0, 10),
          endDate: data.endDate.slice(0, 10),
        });

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    };

    fetchVoucher();

  }, [id]);

  const handleUpdate = async (data: CreateVoucherRequest) => {

    try {

      await updateVoucher(id, data);

      toast.success("Voucher updated");

      router.push(`/venue/voucher/${id}`);

    } catch (err) {

      console.error(err);

      toast.error("Update failed");

    }

  };

  if (loading) return <p>Loading...</p>;

  if (!voucher) return <p>Voucher not found</p>;

  return (
    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-6">
        Edit Voucher
      </h1>

      <VoucherForm
        initialData={voucher}
        onSubmit={handleUpdate}
      />

    </div>
  );
}