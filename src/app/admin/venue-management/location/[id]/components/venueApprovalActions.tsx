"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { acceptAndRejectVenue, updateVenueStatusToInactive } from "@/api/admin/api";
import { VenueApprovalRequest } from "@/api/admin/type";
import { toast } from "sonner";

export default function VenueApprovalActions({ id, status }: { id: number; status: string }) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<"ACTIVE" | "DRAFTED" | "INACTIVE" | null>(null);
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
            toast.success("Đã chấp nhận địa điểm");
            router.push("/admin/venue-management");
          } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "Thao tác thất bại";
            toast.error(errorMessage);
          }
        },
      },
      cancel: {
        label: "Hủy",
        onClick: () => { },
      },
    });
  };

  const handleSubmit = () => {
    if (!action) return;

    const message =
      action === "ACTIVE"
        ? "Bạn có chắc muốn chấp nhận địa điểm này?"
        : action === "INACTIVE"
          ? "Bạn có chắc muốn dừng hoạt động của địa điểm này?"
          : "Bạn có chắc muốn từ chối địa điểm này?";

    toast(message, {
      action: {
        label: action === "ACTIVE" ? "Chấp nhận" : action === "INACTIVE" ? "Dừng hoạt động" : "Từ chối",
        onClick: async () => {
          try {
            if (action === "INACTIVE") {
              await updateVenueStatusToInactive(Number(id), reason);
            } else if (action === "DRAFTED") {
              if (!reason) {
                toast.error("Vui lòng nhập lý do từ chối");
                return;
              }
              const body: VenueApprovalRequest = {
                venueId: Number(id),
                status: action as 'DRAFTED',
                reason: reason,
              };
              await acceptAndRejectVenue(body);
            }
            const successMessages: Record<string, string> = {
              DRAFTED: "Đã từ chối địa điểm",
              INACTIVE: "Đã dừng hoạt động địa điểm",
            };

            toast.success(successMessages[action] || "Thao tác thành công");
            router.push("/admin/venue-management");
          } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "Thao tác thất bại";
            toast.error(errorMessage);
          }
        },
      },
      cancel: {
        label: "Hủy",
        onClick: () => { },
      },
    });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <p className="text-gray-700 font-medium">
          {status === "PENDING"
            ? "Bạn có chấp nhận đơn đăng kí địa điểm này không?"
            : "Quản lý hoạt động của địa điểm"}
        </p>

        <div className="flex gap-4 justify-start">
          {status === "PENDING" ? (
            <>
              <button
                onClick={() => {
                  setAction("DRAFTED");
                  setOpen(true);
                }}
                className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
              >
                Từ chối
              </button>

              <button
                onClick={() => {
                  handleSubmitApproval();
                }}
                className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 cursor-pointer"
              >
                Chấp nhận
              </button>
            </>
          ) : status === "ACTIVE" ? (
            <button
              onClick={() => {
                setAction("INACTIVE");
                setOpen(true);
              }}
              className="px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
            >
              Dừng hoạt động
            </button>
          ) : null}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-100 space-y-4">
            <h2 className="text-lg font-semibold">
              {action === "ACTIVE"
                ? "Lý do chấp nhận"
                : action === "INACTIVE"
                  ? "Lý do dừng hoạt động"
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