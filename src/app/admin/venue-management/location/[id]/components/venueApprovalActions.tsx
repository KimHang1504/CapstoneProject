"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  acceptAndRejectVenue,
  refreshVenueLocationSearchIndexes,
  updateVenueStatusToInactive,
} from "@/api/admin/api";
import { VenueApprovalRequest } from "@/api/admin/type";
import { toast } from "sonner";
import { Mail, Phone, User } from "lucide-react";

type ActionType = "ACTIVE" | "DRAFTED" | "INACTIVE" | null;

export default function VenueApprovalActions({
  id,
  status,
  owner,
}: {
  id: number;
  status: string;
  owner: {
    businessName: string;
    phoneNumber: string;
    email: string;
  };
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<ActionType>(null);
  const [reason, setReason] = useState("");

  const handleSubmitApproval = () => {
    toast("Bạn có chắc chắn muốn chấp nhận địa điểm này?", {
      action: {
        label: "Chấp nhận",
        onClick: async () => {
          try {
            const body: VenueApprovalRequest = {
              venueId: Number(id),
              status: "ACTIVE",
              reason: null,
            };

            await acceptAndRejectVenue(body);

            void refreshVenueLocationSearchIndexes().catch(console.error);

            toast.success("Đã chấp nhận địa điểm");
            router.push("/admin/venue-management");
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Thao tác thất bại"
            );
          }
        },
      },
      cancel: { label: "Hủy", onClick: () => { } },
    });
  };

  const handleSubmit = () => {
    if (!action) return;

    const message =
      action === "INACTIVE"
        ? "Bạn có chắc muốn dừng hoạt động của địa điểm này?"
        : "Bạn có chắc muốn từ chối địa điểm này?";

    toast(message, {
      action: {
        label: action === "INACTIVE" ? "Dừng" : "Từ chối",
        onClick: async () => {
          try {
            if (action === "INACTIVE") {
              await updateVenueStatusToInactive(Number(id), reason);
              void refreshVenueLocationSearchIndexes().catch(console.error);
            }

            if (action === "DRAFTED") {
              if (!reason) {
                toast.error("Vui lòng nhập lý do từ chối");
                return;
              }

              const body: VenueApprovalRequest = {
                venueId: Number(id),
                status: "DRAFTED",
                reason,
              };

              await acceptAndRejectVenue(body);
            }

            toast.success(
              action === "INACTIVE"
                ? "Đã dừng hoạt động địa điểm"
                : "Đã từ chối địa điểm"
            );

            router.push("/admin/venue-management");
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Thao tác thất bại"
            );
          }
        },
      },
      cancel: { label: "Hủy", onClick: () => { } },
    });
  };

  return (
    <>
      {/* FUSED ADMIN PANEL */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-5">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">
            Quản trị địa điểm cho:
          </h2>
        </div>

        {/* OWNER (compact + contextual) */}
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 py-3">
            <User size={14} />
            Chủ địa điểm là
            <p className="text-sm font-medium text-gray-900">
              {owner.businessName}
            </p>
          </div>


          <div className="text-xs text-gray-500 flex gap-2 py-3"><Phone size={14} />Liên hệ: {owner.phoneNumber}</div>
          <div className="text-xs text-gray-500 flex gap-2 py-3"><Mail size={14} />Email: {owner.email}</div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* ACTIONS */}
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Hành động</p>

          {status === "PENDING" && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setAction("DRAFTED");
                  setOpen(true);
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm"
              >
                Từ chối
              </button>

              <button
                onClick={handleSubmitApproval}
                className="flex-1 px-3 py-2 rounded-xl bg-purple-500 text-white hover:bg-purple-600 text-sm"
              >
                Chấp nhận
              </button>
            </div>
          )}

          {status === "ACTIVE" && (
            <button
              onClick={() => {
                setAction("INACTIVE");
                setOpen(true);
              }}
              className="w-full px-3 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 text-sm"
            >
              Dừng hoạt động
            </button>
          )}
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl space-y-5">
            <h2 className="text-lg font-semibold text-center text-gray-800">
              {action === "INACTIVE"
                ? "Lý do dừng hoạt động"
                : "Lý do từ chối"}
            </h2>

            <textarea
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Nhập lý do..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2 rounded-xl border hover:bg-gray-50 transition"
              >
                Hủy
              </button>

              <button
                onClick={handleSubmit}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
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