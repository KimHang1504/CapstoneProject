'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, Edit2, Trash2, Loader } from 'lucide-react';
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
            const res = await getCategories(pageNum, 10);
            setCategories(res.items);
            setTotalPages(res.totalPages);
        } catch (error) {
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
        } catch (error) {
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
        <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 min-h-screen">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Quản lí Danh mục
                    </h1>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition"
                    >
                        <Plus size={20} /> Thêm mới
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-purple-400" size={20} />
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc mô tả..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-200">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader className="animate-spin text-purple-600" size={32} />
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">
                        <p className="text-lg">Không có danh mục nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-purple-100 to-pink-100 border-b border-purple-200">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">Tên</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">Mô tả</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">Trạng thái</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-900">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map((category, idx) => (
                                    <tr
                                        key={category.id}
                                        className={`border-b border-purple-100 hover:bg-purple-50 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-purple-50/30'
                                            }`}
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 truncate">{category.description}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${category.isActive
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {category.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(category)}
                                                    className="p-2 hover:bg-purple-100 text-purple-600 rounded-lg transition"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="p-2 hover:bg-pink-100 text-pink-600 rounded-lg transition"
                                                >
                                                    <Trash2 size={18} />
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

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="flex items-center gap-2 px-4 py-2 border border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 disabled:opacity-50"
                    >
                        <ChevronLeft size={20} /> Trước
                    </button>
                    <span className="text-sm text-gray-600">
                        Trang {page} / {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="flex items-center gap-2 px-4 py-2 border border-pink-300 rounded-lg text-pink-600 hover:bg-pink-50 disabled:opacity-50"
                    >
                        Sau <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full space-y-4 border border-purple-200">
                        <h2 className="text-2xl font-bold text-purple-900">
                            {editingCategory ? 'Chỉnh sửa' : 'Thêm mới'} Danh mục
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    rows={3}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="rounded"
                                />
                                <label className="text-sm font-medium text-gray-700">Hoạt động</label>
                            </div>

                            <div className="flex gap-2 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSubmitting && <Loader size={16} className="animate-spin" />}
                                    {editingCategory ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
