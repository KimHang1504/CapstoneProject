"use client";

// import { approveVenue, rejectVenue } from "@/api/admin/api";
import { useRouter } from "next/navigation";

export default function VenueApprovalActions({ id }: { id: string }) {

  const router = useRouter();

  const handleApprove = async () => {
    // await approveVenue(id);
    alert("Venue approved");
    router.push("/admin/venue-management");
  };

  const handleReject = async () => {
    // await rejectVenue(id);
    alert("Venue rejected");
    router.push("/admin/venue-management");
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 flex justify-end gap-4">
    <p className="flex items-center">Bạn có chấp nhận đơn đăng kí địa điểm này không</p>
      <button
        onClick={handleReject}
        className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
      >
        Từ chối
      </button>

      <button
        onClick={handleApprove}
        className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
      >
        Chấp nhận
      </button>

    </div>
  );
}