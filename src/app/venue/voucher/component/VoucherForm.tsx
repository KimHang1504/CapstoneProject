"use client";

import { useState } from "react";
import { CreateVoucherRequest, DiscountType } from "@/api/venue/vouchers/type";
import SelectLocationModal from "@/app/venue/voucher/component/SelectLocationModal";

type Props = {
  initialData?: CreateVoucherRequest;
  onSubmit: (data: CreateVoucherRequest) => Promise<void>;
};

export default function VoucherForm({ initialData, onSubmit }: Props) {

  const isEdit = !!initialData;

  const defaultForm: CreateVoucherRequest = {
    title: "",
    description: "",
    pointPrice: 0,

    discountType: "FIXED_AMOUNT",
    discountAmount: null,
    discountPercent: null,

    quantity: 1,

    usageLimitPerMember: 1,
    usageValiDays: 7,

    venueLocationIds: [],

    startDate: "",
    endDate: "",
  };

  const [form, setForm] = useState<CreateVoucherRequest>(
    initialData ?? defaultForm
  );

  const [selectedLocationIds, setSelectedLocationIds] = useState<number[]>(
    initialData?.venueLocationIds ?? []
  );

  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = <K extends keyof CreateVoucherRequest>(
    key: K,
    value: CreateVoucherRequest[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {

    const payload: CreateVoucherRequest = {
      ...form,

      venueLocationIds: selectedLocationIds,

      discountAmount:
        form.discountType === "FIXED_AMOUNT"
          ? form.discountAmount
          : null,

      discountPercent:
        form.discountType === "PERCENTAGE"
          ? form.discountPercent
          : null,

      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
    };

    try {

      setLoading(true);

      await onSubmit(payload);

      if (!isEdit) {
        setForm(defaultForm);
        setSelectedLocationIds([]);
      }

    } catch (err) {

      console.error(err);
      alert("Submit failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="mx-20">

      <div className="bg-white space-y-7">

        {/* BASIC INFO */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Tên voucher *
          </label>

          <input
            className="w-full border border-violet-200 rounded-xl px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Nhập tên voucher"
            value={form.title}
            onChange={(e) =>
              handleChange("title", e.target.value)
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Mô tả
          </label>

          <textarea
            rows={3}
            className="w-full border border-violet-200 rounded-xl px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Mô tả ngắn về voucher"
            value={form.description}
            onChange={(e) =>
              handleChange("description", e.target.value)
            }
          />
        </div>


        {/* DISCOUNT TYPE */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Loại giảm giá *
          </label>

          <select
            className="w-full border border-violet-200 rounded-xl px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={form.discountType}
            onChange={(e) =>
              handleChange(
                "discountType",
                e.target.value as DiscountType
              )
            }
          >
            <option value="FIXED_AMOUNT">
              Giảm tiền
            </option>

            <option value="PERCENTAGE">
              Giảm phần trăm
            </option>

          </select>
        </div>


        {/* DISCOUNT VALUE */}
        {form.discountType === "FIXED_AMOUNT" && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Số tiền giảm (VND)
            </label>

            <input
              type="number"
              className="w-full border border-violet-200 rounded-xl px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={form.discountAmount ?? ""}
              onChange={(e) =>
                handleChange(
                  "discountAmount",
                  Number(e.target.value)
                )
              }
            />
          </div>
        )}

        {form.discountType === "PERCENTAGE" && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Phần trăm giảm (%)
            </label>

            <input
              type="number"
              className="w-full border border-violet-200 rounded-xl px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={form.discountPercent ?? ""}
              onChange={(e) =>
                handleChange(
                  "discountPercent",
                  Number(e.target.value)
                )
              }
            />
          </div>
        )}


        {/* PRICE + QUANTITY */}
        <div className="grid grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Giá đổi (Point)
            </label>

            <input
              type="number"
              className="w-full border border-violet-200 rounded-xl px-4 py-3"
              value={form.pointPrice ?? ""}
              onChange={(e) =>
                handleChange(
                  "pointPrice",
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Số lượng
            </label>

            <input
              type="number"
              className="w-full border border-violet-200 rounded-xl px-4 py-3"
              value={form.quantity ?? ""}
              onChange={(e) =>
                handleChange(
                  "quantity",
                  Number(e.target.value) || 0
                )
              }
            />
          </div>

        </div>


        {/* LIMIT */}
        <div className="grid grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Giới hạn mỗi người
            </label>

            <input
              type="number"
              className="w-full border border-violet-200 rounded-xl px-4 py-3"
              value={form.usageLimitPerMember ?? ""}
              onChange={(e) =>
                handleChange(
                  "usageLimitPerMember",
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Hạn sử dụng (ngày)
            </label>

            <input
              type="number"
              className="w-full border border-violet-200 rounded-xl px-4 py-3"
              value={form.usageValiDays || ""}
              onChange={(e) =>
                handleChange(
                  "usageValiDays",
                  Number(e.target.value)
                )
              }
            />
          </div>

        </div>


        {/* DATE */}
        <div className="grid grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Ngày bắt đầu
            </label>

            <input
              type="date"
              className="w-full border border-violet-200 rounded-xl px-4 py-3"
              value={form.startDate}
              onChange={(e) =>
                handleChange("startDate", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Ngày kết thúc
            </label>

            <input
              type="date"
              className="w-full border border-violet-200 rounded-xl px-4 py-3"
              value={form.endDate}
              onChange={(e) =>
                handleChange("endDate", e.target.value)
              }
            />
          </div>

        </div>


        {/* LOCATION */}
        <div>

          <label className="block text-sm font-medium mb-2">
            Địa điểm áp dụng
          </label>

          <button
            type="button"
            onClick={() => setOpenLocationModal(true)}
            className="border border-violet-200 px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Chọn địa điểm
          </button>

          <p className="text-sm text-gray-500 mt-2">
            {selectedLocationIds.length} địa điểm đã chọn
          </p>

        </div>


        {/* SUBMIT */}
        <div className="flex justify-end pt-6">

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-700
            text-white px-8 py-3 rounded-xl"
          >
            {loading
              ? "Đang lưu..."
              : isEdit
              ? "Cập nhật"
              : "Tiếp tục"}
          </button>

        </div>

      </div>

      {openLocationModal && (
        <SelectLocationModal
          selectedIds={selectedLocationIds}
          onChange={setSelectedLocationIds}
          onClose={() => setOpenLocationModal(false)}
        />
      )}

    </div>

  );
}