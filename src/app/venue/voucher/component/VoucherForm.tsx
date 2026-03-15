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
    usageValidDays: 7,

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
    <div className="bg-white border rounded-lg p-6 space-y-6 shadow-sm">

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Voucher Title
        </label>

        <input
          className="w-full border rounded px-3 py-2"
          value={form.title}
          onChange={(e) =>
            handleChange("title", e.target.value)
          }
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Description
        </label>

        <textarea
          className="w-full border rounded px-3 py-2"
          value={form.description}
          onChange={(e) =>
            handleChange("description", e.target.value)
          }
        />
      </div>

      {/* Discount type */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Discount Type
        </label>

        <select
          className="w-full border rounded px-3 py-2"
          value={form.discountType}
          onChange={(e) =>
            handleChange(
              "discountType",
              e.target.value as DiscountType
            )
          }
        >
          <option value="FIXED_AMOUNT">
            Fixed Amount
          </option>

          <option value="PERCENTAGE">
            Percentage
          </option>
        </select>
      </div>

      {/* Discount amount */}
      {form.discountType === "FIXED_AMOUNT" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Discount Amount (VND)
          </label>

          <input
            type="number"
            className="w-full border rounded px-3 py-2"
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

      {/* Discount percent */}
      {form.discountType === "PERCENTAGE" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Discount Percent (%)
          </label>

          <input
            type="number"
            className="w-full border rounded px-3 py-2"
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

{/* Grid fields */}
<div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium mb-1">
      Point Price
    </label>
    <input
      type="number"
      className="w-full border rounded px-3 py-2"
      value={form.pointPrice ?? ""}
      onChange={(e) =>
        handleChange("pointPrice", Number(e.target.value))
      }
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      Quantity
    </label>
    <input
      type="number"
      className="w-full border rounded px-3 py-2"
      value={form.quantity ?? ""}
      onChange={(e) =>
        handleChange("quantity", Number(e.target.value) || 0)
      }
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      Usage Limit Per Member
    </label>
    <input
      type="number"
      className="w-full border rounded px-3 py-2"
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
    <label className="block text-sm font-medium mb-1">
      Usage Valid Days
    </label>
    <input
      type="number"
      className="w-full border rounded px-3 py-2"
      value={form.usageValidDays || ""}
      onChange={(e) =>
        handleChange(
          "usageValidDays",
          Number(e.target.value)
        )
      }
    />
  </div>
</div>

{/* Date */}
<div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium mb-1">
      Start Date
    </label>
    <input
      type="date"
      className="w-full border rounded px-3 py-2"
      value={form.startDate}
      onChange={(e) =>
        handleChange("startDate", e.target.value)
      }
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      End Date
    </label>
    <input
      type="date"
      className="w-full border rounded px-3 py-2"
      value={form.endDate}
      onChange={(e) =>
        handleChange("endDate", e.target.value)
      }
    />
  </div>
</div>

      {/* Locations */}
      <div>

        <button
          type="button"
          onClick={() => setOpenLocationModal(true)}
          className="border px-3 py-2 rounded"
        >
          Choose locations
        </button>

        <p className="text-sm text-gray-500 mt-1">
          {selectedLocationIds.length} locations selected
        </p>

      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-2 rounded"
      >
        {loading
          ? "Saving..."
          : isEdit
            ? "Update Voucher"
            : "Create Voucher"}
      </button>

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