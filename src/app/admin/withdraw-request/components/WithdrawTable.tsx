"use client";

import { approveWithdrawRequest, completeWithdrawRequest, getWithdrawRequests, rejectWithdrawRequest } from "@/api/admin/api";
import { WithdrawRequest } from "@/api/admin/type";
import { uploadImage } from "@/api/upload";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { 
  RefreshCw, 
  ChevronDown, 
  X, 
  Check, 
  XCircle, 
  CheckCircle, 
  Clock, 
  Ban,
  Upload,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Wallet,
  Building2,
  User,
  CreditCard
} from "lucide-react";

export default function WithdrawPage() {
  const [data, setData] = useState<WithdrawRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [status, setStatus] = useState<WithdrawRequest["status"] | "">("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRejectId, setSelectedRejectId] = useState<number | null>(null);

  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedCompleteId, setSelectedCompleteId] = useState<number | null>(null);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofImagePreview, setProofImagePreview] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    fetchData();
  }, [status, pageNumber]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getWithdrawRequests(status, pageNumber, pageSize);
      setData(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalCount(res.data.totalCount || 0);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (id: number) => {
    toast("Bạn có chắc muốn duyệt yêu cầu rút tiền này?", {
      action: {
        label: "Duyệt",
        onClick: async () => {
          try {
            setActionLoading(id);
            await approveWithdrawRequest(id);
            toast.success("Đã duyệt yêu cầu rút tiền");
            fetchData();
          } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "Duyệt yêu cầu thất bại";
            toast.error(errorMessage);
          } finally {
            setActionLoading(null);
          }
        },
      },
      cancel: {
        label: "Hủy",
        onClick: () => {},
      },
    });
  };

  const openRejectModal = (id: number) => {
    setSelectedRejectId(id);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!selectedRejectId) return;
    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      setActionLoading(selectedRejectId);
      await rejectWithdrawRequest(selectedRejectId, rejectReason.trim());
      toast.success("Đã từ chối yêu cầu rút tiền");
      setRejectModalOpen(false);
      setSelectedRejectId(null);
      setRejectReason("");
      fetchData();
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Từ chối yêu cầu thất bại";
      toast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const openCompleteModal = (id: number) => {
    setSelectedCompleteId(id);
    setProofImage(null);
    setProofImagePreview(null);
    setCompleteModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = async () => {
    if (!selectedCompleteId) return;
    if (!proofImage) {
      toast.error("Vui lòng chọn ảnh minh chứng");
      return;
    }

    try {
      setUploadLoading(true);
      const imageUrl = await uploadImage(proofImage);
      
      setActionLoading(selectedCompleteId);
      await completeWithdrawRequest(selectedCompleteId, imageUrl);
      toast.success("Đã hoàn thành yêu cầu rút tiền");
      setCompleteModalOpen(false);
      setSelectedCompleteId(null);
      setProofImage(null);
      setProofImagePreview(null);
      fetchData();
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Hoàn thành yêu cầu thất bại";
      toast.error(errorMessage);
    } finally {
      setUploadLoading(false);
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto p-6 space-y-5">

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-purple-600" />
              Quản lý rút tiền
            </h1>
            <p className="text-sm text-slate-500 mt-1.5">
              {totalCount} yêu cầu rút tiền
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="group px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            <span className="text-sm font-medium">Tải lại</span>
          </button>
        </div>

        <div className="">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Trạng thái:
            </label>
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="min-w-[180px] px-4 py-2.5 border border-purple-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white hover:bg-slate-50 transition-all duration-200 flex items-center justify-between shadow-sm"
              >
                <span className="text-slate-700">
                  {status === "" ? "Tất cả" : 
                   status === "PENDING" ? "Chờ duyệt" :
                   status === "APPROVED" ? "Đã duyệt" :
                   status === "COMPLETED" ? "Hoàn thành" :
                   status === "REJECTED" ? "Từ chối" : "Đã hủy"}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden">
                  {[
                    { value: "", label: "Tất cả", icon: null },
                    { value: "PENDING", label: "Chờ duyệt", icon: Clock },
                    { value: "APPROVED", label: "Đã duyệt", icon: CheckCircle },
                    { value: "COMPLETED", label: "Hoàn thành", icon: Check },
                    { value: "REJECTED", label: "Từ chối", icon: XCircle },
                    { value: "CANCELLED", label: "Đã hủy", icon: Ban },
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setStatus(option.value as WithdrawRequest["status"] | "");
                          setPageNumber(1);
                          setDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-2 ${
                          status === option.value ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                        }`}
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                        {option.label}
                        {status === option.value && <Check className="w-4 h-4 ml-auto text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {status && (
              <button
                onClick={() => {
                  setStatus("");
                  setPageNumber(1);
                }}
                className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">

            <thead className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-purple-600 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-purple-600 uppercase tracking-wider">Wallet</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-purple-600 uppercase tracking-wider">Số tiền</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-purple-600 uppercase tracking-wider">Thông tin ngân hàng</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-purple-600 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-purple-600 uppercase tracking-wider">Thời gian</th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold text-purple-600 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Wallet className="w-16 h-16 mb-3 text-slate-300" strokeWidth={1.5} />
                      <p className="text-sm font-medium text-slate-600">Không có yêu cầu rút tiền nào</p>
                      <p className="text-xs text-slate-400 mt-1">Các yêu cầu rút tiền sẽ hiển thị ở đây</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors duration-150"
                  >
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-slate-700">#{item.id}</span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-sm text-slate-600">#{item.walletId}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-blue-600">
                        {item.amount.toLocaleString('vi-VN')} ₫
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {item.bankInfo.bankName || item.bankInfo.accountName || item.bankInfo.accountNumber ? (
                        <div className="space-y-1">
                          {item.bankInfo.bankName && (
                            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              {item.bankInfo.bankName}
                            </div>
                          )}
                          {item.bankInfo.accountName && (
                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              {item.bankInfo.accountName}
                            </div>
                          )}
                          {item.bankInfo.accountNumber && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                              {item.bankInfo.accountNumber}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 italic">Chưa có thông tin</span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-sm text-slate-600">
                        {new Date(item.requestedAt).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(item.requestedAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-center items-center gap-2">
                        {item.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleApprove(item.id)}
                              disabled={actionLoading === item.id}
                              className="group px-3 py-1.5 text-xs font-medium bg-emerald-400 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow flex items-center gap-1.5"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              {actionLoading === item.id ? "..." : "Duyệt"}
                            </button>
                            <button
                              onClick={() => openRejectModal(item.id)}
                              disabled={actionLoading === item.id}
                              className="group px-3 py-1.5 text-xs font-medium bg-rose-400 text-white rounded-lg hover:from-rose-600 hover:to-red-700 disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow flex items-center gap-1.5"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Từ chối
                            </button>
                          </>
                        )}
                        {item.status === "APPROVED" && (
                          <button
                            onClick={() => openCompleteModal(item.id)}
                            disabled={actionLoading === item.id}
                            className="group px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple -700 disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            {actionLoading === item.id ? "..." : "Hoàn thành"}
                          </button>
                        )}
                        {item.status === "REJECTED" && item.rejectionReason && (
                          <div className="max-w-xs">
                            <p className="text-xs text-red-600 truncate bg-red-50 px-2 py-1 rounded" title={item.rejectionReason}>
                              {item.rejectionReason}
                            </p>
                          </div>
                        )}
                        {item.status === "COMPLETED" && item.proofImageUrl && (
                          <div 
                            onClick={() => setPreviewImageUrl(item.proofImageUrl)}
                            className="cursor-pointer group"
                          >
                            <img 
                              src={item.proofImageUrl} 
                              alt="Minh chứng" 
                              className="w-16 h-16 object-cover rounded-lg border-2 border-slate-200 group-hover:border-blue-400 transition-all duration-200 shadow-sm group-hover:shadow-md"
                            />
                          </div>
                        )}
                        {(item.status === "CANCELLED" || 
                          (item.status === "REJECTED" && !item.rejectionReason) ||
                          (item.status === "COMPLETED" && !item.proofImageUrl)) && (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  Hiển thị <span className="font-semibold text-slate-800">{((pageNumber - 1) * pageSize) + 1}</span> đến{" "}
                  <span className="font-semibold text-slate-800">{Math.min(pageNumber * pageSize, totalCount)}</span> trong tổng số{" "}
                  <span className="font-semibold text-slate-800">{totalCount}</span> kết quả
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPageNumber(1)}
                  disabled={pageNumber === 1}
                  className="p-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
                  title="Trang đầu"
                >
                  <ChevronsLeft className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                  disabled={pageNumber === 1}
                  className="p-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
                  title="Trang trước"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pageNumber <= 3) {
                      pageNum = i + 1;
                    } else if (pageNumber >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = pageNumber - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPageNumber(pageNum)}
                        className={`min-w-[36px] px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          pageNumber === pageNum
                            ? "bg-purple-600 text-white shadow-md"
                            : "border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPageNumber(prev => Math.min(totalPages, prev + 1))}
                  disabled={pageNumber === totalPages}
                  className="p-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
                  title="Trang sau"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => setPageNumber(totalPages)}
                  disabled={pageNumber === totalPages}
                  className="p-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
                  title="Trang cuối"
                >
                  <ChevronsRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Từ chối yêu cầu rút tiền</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Vui lòng nhập lý do từ chối</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-5">
              <textarea
                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                rows={4}
                placeholder="Nhập lý do từ chối..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div className="px-6 py-4 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={() => {
                  setRejectModalOpen(false);
                  setSelectedRejectId(null);
                  setRejectReason("");
                }}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading === selectedRejectId || !rejectReason.trim()}
                className="px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl hover:from-rose-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                {actionLoading === selectedRejectId ? "Đang xử lý..." : "Xác nhận từ chối"}
              </button>
            </div>
          </div>
        </div>
      )}

      {completeModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Hoàn thành rút tiền</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Tải lên ảnh minh chứng chuyển khoản</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-5">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 group"
              >
                {proofImagePreview ? (
                  <div className="relative">
                    <img
                      src={proofImagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProofImage(null);
                        setProofImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-slate-400 group-hover:text-blue-500 transition-colors">
                    <div className="mx-auto w-16 h-16 mb-4 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">Click để chọn ảnh</p>
                    <p className="text-xs text-slate-400 mt-2">PNG, JPG, JPEG (tối đa 10MB)</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="px-6 py-4 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={() => {
                  setCompleteModalOpen(false);
                  setSelectedCompleteId(null);
                  setProofImage(null);
                  setProofImagePreview(null);
                }}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleComplete}
                disabled={uploadLoading || actionLoading === selectedCompleteId || !proofImage}
                className="px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {uploadLoading || actionLoading === selectedCompleteId
                  ? "Đang xử lý..."
                  : "Xác nhận hoàn thành"}
              </button>
            </div>
          </div>
        </div>
      )}

      {previewImageUrl && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImageUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImageUrl}
              alt="preview"
              onClick={(e) => {
                e.stopPropagation();
                setZoom((z) => (z === 1 ? 2 : 1));
              }}
              className="max-w-full max-h-full object-contain transition-transform duration-200 cursor-zoom-in"
              style={{ transform: `scale(${zoom})` }}
            />
            <a
              href={previewImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm flex items-center gap-2 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <ImageIcon className="w-4 h-4" />
              Mở trong tab mới
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    PENDING: { 
      bg: "bg-gradient-to-r from-amber-50 to-yellow-50", 
      text: "text-amber-700", 
      border: "border-amber-200", 
      label: "Chờ duyệt",
      icon: Clock
    },
    APPROVED: { 
      bg: "bg-gradient-to-r from-emerald-50 to-green-50", 
      text: "text-emerald-700", 
      border: "border-emerald-200", 
      label: "Đã duyệt",
      icon: CheckCircle
    },
    COMPLETED: { 
      bg: "bg-gradient-to-r from-blue-50 to-indigo-50", 
      text: "text-blue-700", 
      border: "border-blue-200", 
      label: "Hoàn thành",
      icon: Check
    },
    REJECTED: { 
      bg: "bg-gradient-to-r from-red-50 to-rose-50", 
      text: "text-red-700", 
      border: "border-red-200", 
      label: "Từ chối",
      icon: XCircle
    },
    CANCELLED: { 
      bg: "bg-gradient-to-r from-slate-50 to-gray-50", 
      text: "text-slate-700", 
      border: "border-slate-200", 
      label: "Đã hủy",
      icon: Ban
    },
  };

  const style = config[status as keyof typeof config] || config.CANCELLED;
  const Icon = style.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}>
      <Icon className="w-3.5 h-3.5" />
      {style.label}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-slate-200 rounded-lg w-full"></div>
        </td>
      ))}
    </tr>
  );
}
