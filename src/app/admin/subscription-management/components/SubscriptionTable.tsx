"use client";

import { getSubscriptionPackages, deleteSubscriptionPackage, updateSubscriptionPackage } from "@/api/admin/subscription/api";
import { SubscriptionPackage, PackageType } from "@/api/admin/subscription/type";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  RefreshCw,
  ChevronDown,
  X,
  Check,
  Package,
  Clock,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Users,
  Building2,
  UserCircle,
  Calendar,
  DollarSign,
} from "lucide-react";
import CreatePackageModal from "./CreatePackageModal";
import EditPackageModal from "./EditPackageModal";
import DeletePackageModal from "./DeletePackageModal";

export default function SubscriptionTable() {
  const [data, setData] = useState<SubscriptionPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [typeFilter, setTypeFilter] = useState<PackageType | "">("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<SubscriptionPackage | null>(null);

  useEffect(() => {
    fetchData();
  }, [typeFilter]);

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
      const res = await getSubscriptionPackages(
        typeFilter ? { type: typeFilter } : undefined
      );
      setData(res.data || []);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (pkg: SubscriptionPackage) => {
    toast(`Bạn có chắc muốn ${pkg.isActive ? 'vô hiệu hóa' : 'kích hoạt'} gói này?`, {
      action: {
        label: "Xác nhận",
        onClick: async () => {
          try {
            setActionLoading(pkg.id);
            await updateSubscriptionPackage(pkg.id, {
              packageName: pkg.packageName,
              price: pkg.price,
              durationDays: pkg.durationDays,
              description: pkg.description || undefined,
              isActive: !pkg.isActive,
            });
            toast.success(`Đã ${!pkg.isActive ? 'kích hoạt' : 'vô hiệu hóa'} gói`);
            fetchData();
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Cập nhật thất bại";
            toast.error(errorMessage);
          } finally {
            setActionLoading(null);
          }
        },
      },
      cancel: {
        label: "Hủy",
        onClick: () => { },
      },
    });
  };

  const openEditModal = (pkg: SubscriptionPackage) => {
    setSelectedPackage(pkg);
    setEditModalOpen(true);
  };

  const openDeleteModal = (pkg: SubscriptionPackage) => {
    setSelectedPackage(pkg);
    setDeleteModalOpen(true);
  };

  const getTypeIcon = (type: PackageType) => {
    switch (type) {
      case "MEMBER":
        return Users;
      case "VENUE":
        return Building2;
      case "VENUEOWNER":
        return UserCircle;
      default:
        return Package;
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
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-gray-700" />
              Quản lý gói subscription
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Tổng số: {data.length} gói
            </p>
          </div>

          {/* <div className="flex gap-2">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Tạo gói mới
            </button> */}

          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Tải lại
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">
            Loại gói:
          </label>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <span className="text-gray-700">
                {typeFilter === "" ? "Tất cả" : getTypeLabel(typeFilter)}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                {[
                  { value: "", label: "Tất cả", icon: Package },
                  { value: "MEMBER", label: "Thành viên", icon: Users },
                  { value: "VENUE", label: "Địa điểm", icon: Building2 },
                  { value: "VENUEOWNER", label: "Chủ địa điểm", icon: UserCircle },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setTypeFilter(option.value as PackageType | "");
                        setDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${typeFilter === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {option.label}
                      {typeFilter === option.value && <Check className="w-4 h-4 ml-auto text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {typeFilter && (
            <button
              onClick={() => setTypeFilter("")}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">Tên gói</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">Loại</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">Giá</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">Thời hạn</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">Ngày tạo</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Package className="w-12 h-12 mb-3 text-gray-300" />
                      <p className="text-sm font-medium text-gray-600">Không có gói subscription nào</p>
                      <p className="text-xs text-gray-500 mt-1">Các gói subscription sẽ hiển thị ở đây</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((pkg) => {
                  const TypeIcon = getTypeIcon(pkg.type);
                  return (
                    <tr
                      key={pkg.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-700">#{pkg.id}</span>
                      </td>

                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{pkg.packageName}</div>
                          {pkg.description && (
                            <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{pkg.description}</div>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          <TypeIcon className="w-3.5 h-3.5" />
                          {getTypeLabel(pkg.type)}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-sm font-semibold text-green-600">
                            {pkg.price.toLocaleString('vi-VN')} ₫
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm text-gray-700">{pkg.durationDays} ngày</span>
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(pkg)}
                          disabled={actionLoading === pkg.id}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors disabled:opacity-50 ${pkg.isActive
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                            }`}
                        >
                          {pkg.isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {pkg.isActive ? "Hoạt động" : "Vô hiệu"}
                        </button>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(pkg.createdAt).toLocaleDateString("vi-VN")}
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => openEditModal(pkg)}
                            disabled={actionLoading === pkg.id}
                            className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Sửa
                          </button>
                          <button
                            onClick={() => openDeleteModal(pkg)}
                            disabled={actionLoading === pkg.id}
                            className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    //       {createModalOpen && (
    //         <CreatePackageModal
    //           onClose={() => setCreateModalOpen(false)}
    //           onSuccess={() => {
    //             setCreateModalOpen(false);
    //             fetchData();
    //           }}
    //         />
    //       )}

    //       {editModalOpen && selectedPackage && (
    //         <EditPackageModal
    //           package={selectedPackage}
    //           onClose={() => {
    //             setEditModalOpen(false);
    //             setSelectedPackage(null);
    //           }}
    //           onSuccess={() => {
    //             setEditModalOpen(false);
    //             setSelectedPackage(null);
    //             fetchData();
    //           }}
    //         />
    //       )}

    //       {deleteModalOpen && selectedPackage && (
    //         <DeletePackageModal
    //           package={selectedPackage}
    //           onClose={() => {
    //             setDeleteModalOpen(false);
    //             setSelectedPackage(null);
    //           }}
    //           onSuccess={() => {
    //             setDeleteModalOpen(false);
    //             setSelectedPackage(null);
    //             fetchData();
    //           }}
    //         />
    //       )}
    //     </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );
}
