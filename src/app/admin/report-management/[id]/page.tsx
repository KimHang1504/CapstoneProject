'use client';

import {
  getReportDetail,
  approveReport,
  rejectReport,
} from "@/api/admin/api";
import { Report } from "@/api/admin/type";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchDetail();
    }
  }, []);

  const fetchDetail = async () => {
    try {
      const res = await getReportDetail(id);
      setReport(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };


  const handleApprove = async () => {
    if (!report) return;
    toast("Bạn có chắc muốn duyệt báo cáo này không?", {
      action: {
        label: "Duyệt",
        onClick: async () => {
          try {
            const res = await approveReport(report.id);
            if (res.code === 200) {
              toast.success("Đã duyệt báo cáo");
              setReport({ ...report, status: "APPROVED" });
              setTimeout(() => {
                router.push("/admin/report-management");
              }, 800);
            } else {
              toast.error("Duyệt báo cáo thất bại");
              return;
            }
          } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "Duyệt báo cáo thất bại";
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

  const handleReject = async () => {
    if (!report) return;
    toast("Bạn có chắc muốn từ chối báo cáo này không?", {
      action: {
        label: "Từ chối",
        onClick: async () => {
          try {
            const res = await rejectReport(report.id);
            if (res.code === 200) {
              toast.success("Đã từ chối báo cáo");
              setReport({ ...report, status: "REJECTED" });
              setTimeout(() => {
                router.push("/admin/report-management");
              }, 800);
            } else {
              toast.error("Từ chối báo cáo thất bại");
              return;
            }
          } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "Từ chối báo cáo thất bại";
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


  if (loading) return <SkeletonDetail />;

  if (!report) return <div className="p-6">Không tìm thấy báo cáo</div>;

  const isDone = report.status !== "PENDING";

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f5f3ff] to-white p-8">
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Chi tiết báo cáo #{report.id}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Review và xử lý các báo cáo vi phạm từ người dùng
          </p>
        </div>

        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition cursor-pointer"
        >
          ← Trở lại
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="p-6 border-b border-gray-300 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Report ID</p>
            <p className="text-xl font-semibold">#{report.id}</p>
          </div>

          <StatusBadge status={report.status} />
        </div>

        <div className="grid grid-cols-2 gap-6 p-6">
          <InfoCard label="Người báo cáo" value={report.reporterName} />
          <InfoCard label="Loại mục tiêu" value={report.targetType} />
          <InfoCard
            label="Được báo cáo vào lúc"
            value={new Date(report.createdAt).toLocaleString()}
          />
        </div>

        <div className="px-6 pb-6">
          <p className="text-sm mb-2">Lí do báo cáo</p>
          <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 text-gray-700">
            {report.reason}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            disabled={actionLoading || report.status !== "PENDING"}
            onClick={handleReject}
            className="cursor-pointer px-5 py-2 rounded-lg border text-red-500 border-red-200 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {actionLoading ? <Spinner /> : "Reject"}
          </button>

          <button
            disabled={actionLoading || report.status !== "PENDING"}
            onClick={handleApprove}
            className="cursor-pointer px-5 py-2 rounded-lg bg-[#B388EB] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
          >
            {actionLoading ? <Spinner /> : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}


function InfoCard({ label, value }: any) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-300">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "PENDING"
      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
      : status === "REJECTED"
        ? "bg-red-100 text-red-600 border-red-200"
        : "bg-green-100 text-green-600 border-green-200";

  return (
    <span
      className={`px-4 py-1.5 rounded-full text-sm font-medium border ${style}`}
    >
      {status}
    </span>
  );
}


function Spinner() {
  return (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );
}


function SkeletonDetail() {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}