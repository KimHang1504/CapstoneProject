'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, Edit2, Trash2, Loader, FolderOpen, X, RefreshCw, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api/category/api';
import { Category } from '@/api/category/type';
import { toast } from 'sonner';

export default function CategoryManagementPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', isActive: true });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch categories
    const fetchCategories = async (pageNum: number) => {
        setLoading(true);
        try {
            const res = await getCategories(pageNum, 5);
            setCategories(res.items);
            setTotalPages(res.totalPages);
        } catch{
            toast.error('Lỗi khi tải danh sách');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(page);
    }, [page]);

    // Filter categories
    const filteredCategories = useMemo(() => {
        return categories.filter(cat =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [categories, searchTerm]);

    // Handle modal open/close
    const openAddModal = () => {
        setEditingCategory(null);
        setFormData({ name: '', description: '', isActive: true });
        setIsModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, description: category.description, isActive: category.isActive });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '', isActive: true });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, formData);
                toast.success('Cập nhật thành công');
            } else {
                await createCategory(formData);
                toast.success('Tạo mới thành công');
            }
            closeModal();
            fetchCategories(page);
        } catch {
            toast.error('Có lỗi xảy ra');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id: number) => {
        toast("Bạn có chắc muốn xóa danh mục này không?", {
            action: {
                label: "Xóa",
                onClick: async () => {
                    try {
                        await deleteCategory(id);

                        // reload list
                        const res = await getCategories(page, 10);
                        setCategories(res.items);
                        setTotalPages(res.totalPages);

                        toast.success("Xóa thành công");
                    } catch (error) {
                        console.error(error);
                        const errorMessage =
                            error instanceof Error ? error.message : "Xóa thất bại";
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
            <div className="max-w-7xl mx-auto p-6 space-y-5">
                {/* HEADER */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
                            <FolderOpen className="w-6 h-6 text-purple-600" />
                            Quản lý danh mục
                        </h1>
                        <p className="text-sm text-slate-500 mt-1.5">
                            {categories.length} danh mục
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fetchCategories(page)}
                            disabled={loading}
                            className="group px-4 py-2.5 bg-white cursor-pointer border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                            <span className="text-sm font-medium">Tải lại</span>
                        </button>
                        <button
                            onClick={openAddModal}
                            className="px-4 py-2.5 cursor-pointer bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 shadow-md"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="text-sm font-medium">Thêm mới</span>
                        </button>
                    </div>
                </div>

                {/* FILTER */}
                <div className="">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên hoặc mô tả..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 border border-purple-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white hover:bg-slate-50 transition-all duration-200"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader className="animate-spin text-blue-600" size={32} />
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="py-16 text-center">
                            <div className="flex flex-col items-center justify-center text-slate-400">
                                <FolderOpen className="w-16 h-16 mb-3 text-slate-300" strokeWidth={1.5} />
                                <p className="text-sm font-medium text-slate-600">Không có danh mục nào</p>
                                <p className="text-xs text-slate-400 mt-1">Các danh mục sẽ hiển thị ở đây</p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-purple-600 uppercase tracking-wider">Tên</th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-purple-600 uppercase tracking-wider">Mô tả</th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-purple-600 uppercase tracking-wider">Trạng thái</th>
                                        <th className="px-4 py-3.5 text-center text-xs font-semibold text-purple-600 uppercase tracking-wider">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {filteredCategories.map((category) => (
                                        <tr
                                            key={category.id}
                                            className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors duration-150"
                                        >
                                            <td className="px-4 py-4">
                                                <span className="text-sm font-semibold text-slate-700">{category.name}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm text-slate-600">{category.description}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                                                        category.isActive
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    {category.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(category)}
                                                        className="p-2 cursor-pointer hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category.id)}
                                                        className="p-2 cursor-pointer hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* PAGINATION */}
                {!loading && totalPages > 1 && (
                    <div className="">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-600">
                                    Trang <span className="font-semibold text-slate-800">{page}</span> / <span className="font-semibold text-slate-800">{totalPages}</span>
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(1)}
                                    disabled={page === 1}
                                    className="p-2 cursor-pointer text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
                                    title="Trang đầu"
                                >
                                    <ChevronsLeft className="w-4 h-4 text-slate-600" />
                                </button>
                                <button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="p-2 cursor-pointer text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
                                    title="Trang trước"
                                >
                                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                                </button>
                                
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (page <= 3) {
                                            pageNum = i + 1;
                                        } else if (page >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = page - 2 + i;
                                        }
                                        
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`min-w-[36px] px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                    page === pageNum
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
                                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 cursor-pointer text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
                                    title="Trang sau"
                                >
                                    <ChevronRight className="w-4 h-4 text-slate-600" />
                                </button>
                                <button
                                    onClick={() => setPage(totalPages)}
                                    disabled={page === totalPages}
                                    className="p-2 cursor-pointer text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:border-slate-400"
                                    title="Trang cuối"
                                >
                                    <ChevronsRight className="w-4 h-4 text-slate-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL */}
                {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-5 border border-slate-200 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-slate-800">
                                {editingCategory ? 'Chỉnh sửa' : 'Thêm mới'} danh mục
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-1.5 cursor-pointer hover:bg-slate-100 rounded-lg transition-colors duration-200"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tên danh mục</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-slate-50 transition-all duration-200"
                                    placeholder="Nhập tên danh mục..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-slate-50 transition-all duration-200 resize-none"
                                    rows={3}
                                    placeholder="Nhập mô tả..."
                                />
                            </div>

                            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <label className="text-sm font-medium text-slate-700">Kích hoạt danh mục</label>
                            </div>

                            <div className="flex gap-3 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2.5 border cursor-pointer border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2.5 bg-gradient-to-r cursor-pointer from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-md"
                                >
                                    {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
                                    {editingCategory ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}
