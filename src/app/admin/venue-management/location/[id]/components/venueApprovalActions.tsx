"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { acceptAndRejectVenue } from "@/api/admin/api";
import { VenueApprovalRequest } from "@/api/admin/type";

export default function VenueApprovalActions({ id }: { id: string }) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<"ACTIVE" | "DRAFTED" | null>(null);
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    if (!action) return;

    const body: VenueApprovalRequest = {
      venueId: Number(id),
      status: action,
      reason: reason,
    };

    console.log(body);

    await acceptAndRejectVenue(body);

    alert(`Venue ${action}`);
    router.push("/admin/venue-management");
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
        <p>Bạn có chấp nhận đơn đăng kí địa điểm này không?</p>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setAction("DRAFTED");
              setOpen(true);
            }}
            className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Từ chối
          </button>

          <button
            onClick={() => {
              setAction("ACTIVE");
              setOpen(true);
            }}
            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Chấp nhận
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-100 space-y-4">
            <h2 className="text-lg font-semibold">
              {action === "ACTIVE"
                ? "Lý do chấp nhận"
                : "Lý do từ chối"}
            </h2>

            <textarea
              className="w-full border rounded-lg p-2"
              rows={4}
              placeholder="Nhập lý do..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Hủy
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}