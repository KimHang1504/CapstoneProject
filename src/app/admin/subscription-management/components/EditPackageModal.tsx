"use client";

import { updateSubscriptionPackage } from "@/api/admin/subscription/api";
import { SubscriptionPackage, PackageType } from "@/api/admin/subscription/type";
import { useState } from "react";
import { toast } from "sonner";
import { X, Pencil, Users, Building2, UserCircle } from "lucide-react";

interface EditPackageModalProps {
  package: SubscriptionPackage;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditPackageModal({ package: pkg, onClose, onSuccess }: EditPackageModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    packageName: pkg.packageName,
    price: pkg.price.toString(),
    durationDays: pkg.durationDays.toString(),
    description: pkg.description || "",
    isActive: pkg.isActive,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.packageName.trim()) {
      newErrors.packageName = "Vui lòng nhập tên gói";
    } else if (formData.packageName.length > 200) {
      newErrors.packageName = "Tên gói không được vượt quá 200 ký tự";
    }

    const price = parseFloat(formData.price);
    if (!formData.price) {
      newErrors.price = "Vui lòng nhập giá";
    } else if (isNaN(price) || price < 0) {
      newErrors.price = "Giá phải là số không âm";
    }

    const durationDays = parseInt(formData.durationDays);
    if (!formData.durationDays) {
      newErrors.durationDays = "Vui lòng nhập thời hạn";
    } else if (isNaN(durationDays) || durationDays < 1 || durationDays > 3650) {
      newErrors.durationDays = "Thời hạn phải từ 1 đến 3650 ngày";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Mô tả không được vượt quá 1000 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    try {
      setLoading(true);
      await updateSubscriptionPackage(pkg.id, {
        packageName: formData.packageName.trim(),
        price: parseFloat(formData.price),
        durationDays: parseInt(formData.durationDays),
        description: formData.description.trim() || undefined,
        isActive: formData.isActive,
      });
      toast.success("Cập nhật gói subscription thành công");
      onSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Cập nhật gói thất bại";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: PackageType) => {
    switch (type) {
      case "MEMBER":
        return Users;
      case "VENUE":
        return Building2;
      case "VENUEOWNER":
        return UserCircle;
    }
  };

  const getTypeLabel = (type: PackageType) => {
    switch (type) {
      case "MEMBER":
        return "Thành viên";
      case "VENUE":
        return "Địa điểm";
      case "VENUEOWNER":
        return "Chủ địa điểm";
    }
  };

  const TypeIcon = getTypeIcon(pkg.type);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Pencil className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Chỉnh sửa gói subscription</h2>
                <p className="text-sm text-slate-500 mt-0.5">Cập nhật thông tin gói #{pkg.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tên gói <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.packageName}
              onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
              className={`w-full border ${errors.packageName ? 'border-red-300' : 'border-slate-300'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="VD: Gói Premium"
            />
            {errors.packageName && (
              <p className="text-xs text-red-600 mt-1.5">{errors.packageName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Loại gói
            </label>
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl">
              <TypeIcon className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">{getTypeLabel(pkg.type)}</span>
              <span className="ml-auto text-xs text-slate-500 italic">Không thể thay đổi</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Giá (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={`w-full border ${errors.price ? 'border-red-300' : 'border-slate-300'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="VD: 99000"
              />
              {errors.price && (
                <p className="text-xs text-red-600 mt-1.5">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Thời hạn (ngày) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="3650"
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                className={`w-full border ${errors.durationDays ? 'border-red-300' : 'border-slate-300'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="VD: 30"
              />
              {errors.durationDays && (
                <p className="text-xs text-red-600 mt-1.5">{errors.durationDays}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hoạt động gói
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={formData.isActive}
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              className="w-full flex items-center justify-between px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className={`text-sm font-medium ${formData.isActive ? "text-emerald-700" : "text-slate-600"}`}>
                {formData.isActive ? "Đang hoạt động" : "Đã ngưng"}
              </span>
              <span
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? "bg-emerald-500" : "bg-slate-300"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? "translate-x-6" : "translate-x-1"}`}
                />
              </span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`w-full border ${errors.description ? 'border-red-300' : 'border-slate-300'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all`}
              placeholder="Mô tả chi tiết về gói subscription..."
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1.5">{errors.description}</p>
            )}
            <p className="text-xs text-slate-400 mt-1.5">{formData.description.length}/1000 ký tự</p>
          </div>

        </form>

        <div className="px-6 py-4 bg-slate-50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 cursor-pointer text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2.5 cursor-pointer text-sm font-medium bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
}
