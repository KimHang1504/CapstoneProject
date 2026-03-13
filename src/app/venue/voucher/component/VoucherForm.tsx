"use client";

import { useState } from "react";
import { createVoucher } from "@/api/venue/vouchers/api";
import { DiscountType } from "@/api/venue/vouchers/type";
import SelectLocationModal from "@/app/venue/voucher/component/SelectLocationModal";

export default function VoucherForm() {

  const [discountType, setDiscountType] = useState<DiscountType>("FIXED_AMOUNT");
  const [selectedLocationIds, setSelectedLocationIds] = useState<number[]>([]);
  const [openLocationModal, setOpenLocationModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    pointPrice: 0,

    discountAmount: 0,
    discountPercent: 0,

    quantity: 1,
    usageLimitPerMember: 1,
    usageValidDays: 7,

    venueLocationIds: [] as number[],

    startDate: "",
    endDate: "",
  });

  const handleChange = (key: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async () => {

    const payload = {
      ...form,
      discountType,
      venueLocationIds: selectedLocationIds,
      discountAmount:
        discountType === "FIXED_AMOUNT"
          ? form.discountAmount
          : null,

      discountPercent:
        discountType === "PERCENTAGE"
          ? form.discountPercent
          : null,

      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
    };

    try {

      const res = await createVoucher(payload);

      console.log(res.data);

      alert("Voucher created");

    } catch (err) {
      console.error(err);
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
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Enter voucher title"
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
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Enter voucher description"
          value={form.description}
          onChange={(e) =>
            handleChange("description", e.target.value)
          }
        />
      </div>

      {/* Discount Type */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Discount Type
        </label>

        <select
          className="w-full border rounded px-3 py-2"
          value={discountType}
          onChange={(e) =>
            setDiscountType(e.target.value as DiscountType)
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

      {/* Discount Value */}
      {discountType === "FIXED_AMOUNT" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Discount Amount (VND)
          </label>

          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            placeholder="50000"
            onChange={(e) =>
              handleChange("discountAmount", Number(e.target.value))
            }
          />
        </div>
      )}

      {discountType === "PERCENTAGE" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Discount Percent (%)
          </label>

          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            placeholder="10"
            onChange={(e) =>
              handleChange("discountPercent", Number(e.target.value))
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
            onChange={(e) =>
              handleChange("quantity", Number(e.target.value))
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
            onChange={(e) =>
              handleChange("usageLimitPerMember", Number(e.target.value))
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
            onChange={(e) =>
              handleChange("usageValidDays", Number(e.target.value))
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
            onChange={(e) =>
              handleChange("endDate", e.target.value)
            }
          />
        </div>

      </div>
      <div className="mt-4">
        <label className="block mb-1">Apply locations</label>

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
      <div className="pt-4">

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          Create Voucher
        </button>

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