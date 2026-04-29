"use client";

import { SubscriptionPackage } from "@/api/admin/subscription/type";
import { AlertTriangle, Power, X } from "lucide-react";

interface DeletePackageModalProps {
  package: SubscriptionPackage;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeletePackageModal({ package: pkg, loading = false, onClose, onConfirm }: DeletePackageModalProps) {

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Xác nhận ngưng hoạt động gói</h2>
              <p className="text-sm text-slate-500 mt-0.5">Gói sẽ bị dừng bán cho lượt mua mới</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-800">
                  Xác nhận ngưng hoạt động gói
                </p>
                <p className="text-sm text-red-700">
                  Các subscription đã mua từ gói này vẫn tiếp tục hoạt động đến hết hạn. Sau khi ngưng hoạt động, người dùng sẽ không thể mua mới gói này nữa.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-semibold text-slate-800">Thông tin gói sẽ xóa:</h3>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tên gói:</span>
                <span className="font-semibold text-slate-800">{pkg.packageName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Loại:</span>
                <span className="font-semibold text-slate-800">{pkg.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Giá:</span>
                <span className="font-semibold text-emerald-600">{pkg.price.toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600">
            Bạn có chắc chắn muốn ngưng hoạt động gói subscription này không?
          </p>
        </div>

        <div className="px-6 py-4 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2.5 text-sm font-medium bg-linear-to-r from-rose-500 to-red-600 text-white rounded-xl hover:from-rose-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2"
          >
            <Power className="w-4 h-4" />
            {loading ? "Đang xử lý..." : "Xác nhận ngưng hoạt động"}
          </button>
        </div>
      </div>
    </div>
  );
}
