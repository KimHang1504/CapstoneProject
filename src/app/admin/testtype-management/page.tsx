"use client";

import {
  createTestType,
  deleteTestType,
  getAllTestTypes,
  importQuestionsForTestType,
  updateTestType,
} from "@/api/admin/testtype/api";
import { TestType } from "@/api/admin/testtype/type";
import { useEffect, useState } from "react";
import { TestTypeRowForm } from "./types";
import TestTypeTable from "@/app/admin/testtype-management/components/TestTypeTable";
import { RefreshCw, Plus, ListChecks } from "lucide-react";
import { toast } from "sonner";

const initialNewRow: TestTypeRowForm = {
  name: "",
  description: "",
  totalQuestions: "",
};

export default function TestTypePage() {
  const [items, setItems] = useState<TestType[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreating, setIsCreating] = useState(false);
  const [savingCreate, setSavingCreate] = useState(false);
  const [newRow, setNewRow] = useState<TestTypeRowForm>(initialNewRow);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editRow, setEditRow] = useState<TestTypeRowForm>(initialNewRow);

  const [error, setError] = useState("");
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  const [importingId, setImportingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTestTypes = async () => {
      try {
        const res = await getAllTestTypes();
        setItems(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestTypes();
  }, []);

  const refreshList = async () => {
    const res = await getAllTestTypes();
    setItems(res.data);
  };

  const handleCreateRow = () => {
    setError("");
    setSuccessMessage("");
    setImportErrors([]);
    setNewRow(initialNewRow);
    setIsCreating(true);
    setEditingId(null);
  };

  const handleCancelCreate = () => {
    setError("");
    setNewRow(initialNewRow);
    setIsCreating(false);
  };

  const handleChangeNewRow = (field: keyof TestTypeRowForm, value: string) => {
    setNewRow((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = (id: number) => {
    toast.custom((t) => (
      <div className="bg-white rounded-xl shadow-lg border border-red-300 p-4 w-[320px] space-y-3">
        <h4 className="font-semibold text-gray-800 text-sm">
          Xóa loại bài kiểm tra tính cách
        </h4>

        <p className="text-sm text-gray-600">
          Bạn có chắc muốn xóa không?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md"
          >
            Hủy
          </button>

          <button
            onClick={async () => {
              toast.dismiss(t);

              const loadingId = toast.loading("Đang xóa...");

              try {
                const res = await deleteTestType(id);

                await refreshList();

                toast.success(
                  res.message || "Xóa thành công",
                  { id: loadingId }
                );
              } catch (error: any) {
                console.error(error);

                toast.error(
                  error?.message || "Xóa thất bại",
                  { id: loadingId }
                );
              }
            }}
            className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Xóa
          </button>
        </div>
      </div>
    ));
  };

  const validateRow = (row: TestTypeRowForm) => {
    if (!row.name.trim()) {
      return "Vui lòng nhập tên";
    }

    if (!row.description.trim()) {
      return "Vui lòng nhập mô tả";
    }

    if (!row.totalQuestions.trim()) {
      return "Vui lòng nhập số câu hỏi";
    }

    const totalQuestions = Number(row.totalQuestions);

    if (Number.isNaN(totalQuestions) || totalQuestions <= 0) {
      return "Số câu hỏi phải lớn hơn 0";
    }

    return "";
  };

  const handleSaveCreate = async () => {
    setError("");
    setSuccessMessage("");
    setImportErrors([]);

    const validationError = validateRow(newRow);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSavingCreate(true);

      await createTestType({
        name: newRow.name.trim(),
        description: newRow.description.trim(),
        totalQuestions: Number(newRow.totalQuestions),
      });

      await refreshList();

      setSuccessMessage("Tạo test type thành công");
      setIsCreating(false);
      setNewRow(initialNewRow);
    } catch (error: any) {
      console.error(error);
      setError(error?.message || "Tạo test type thất bại");
    } finally {
      setSavingCreate(false);
    }
  };

  const handleStartEdit = (item: TestType) => {
    setError("");
    setSuccessMessage("");
    setImportErrors([]);
    setIsCreating(false);
    setEditingId(item.id);
    setEditRow({
      name: item.name ?? "",
      description: item.description ?? "",
      totalQuestions: String(item.totalQuestions ?? ""),
    });
  };

  const handleCancelEdit = () => {
    setError("");
    setEditingId(null);
    setEditRow(initialNewRow);
  };

  const handleChangeEditRow = (
    field: keyof TestTypeRowForm,
    value: string
  ) => {
    setEditRow((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = async (id: number) => {
    setError("");
    setSuccessMessage("");
    setImportErrors([]);

    const validationError = validateRow(editRow);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSavingEdit(true);

      await updateTestType(id, {
        name: editRow.name.trim(),
        description: editRow.description.trim(),
        totalQuestions: Number(editRow.totalQuestions),
      });

      await refreshList();

      setSuccessMessage("Cập nhật test type thành công");
      setEditingId(null);
      setEditRow(initialNewRow);
    } catch (error: any) {
      console.error(error);
      setError(error?.message || "Cập nhật test type thất bại");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleImportFile = async (id: number, file: File | null) => {
    setError("");
    setImportErrors([]);
    setSuccessMessage("");

    if (!file) return;

    try {
      setImportingId(id);

      const res = await importQuestionsForTestType(id, file);
      const result = res.data;

      if (result.errors && result.errors.length > 0) {
        setImportErrors(result.errors);
      } else {
        setSuccessMessage(
          `Import thành công ${result.insertedQuestions}/${result.totalRows} câu hỏi`
        );
      }

      await refreshList();
    } catch (error: any) {
      console.error(error);

      const importResult = error?.data?.data ?? error?.data;

      if (importResult?.errors?.length > 0) {
        setImportErrors(importResult.errors);
        return;
      }

      setError(error?.message || "Import file thất bại");
    } finally {
      setImportingId(null);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await refreshList();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50/40 to-violet-50/30">
      <div className="w-full mx-auto px-6 py-4 space-y-5">

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
              <ListChecks className="w-6 h-6 text-violet-600" />
              Quản lý loại bài test
            </h1>
            <p className="text-sm text-slate-500 mt-1.5">
              {items.length} loại bài test
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="group cursor-pointer px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-violet-50 hover:border-violet-200 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Tải lại</span>
            </button>

            <button
              onClick={handleCreateRow}
              disabled={isCreating || editingId !== null}
              className="cursor-pointer px-4 py-2.5 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Tạo mới</span>
            </button>
          </div>
        </div>

        <TestTypeTable
          items={items}
          loading={loading}
          isCreating={isCreating}
          editingId={editingId}
          savingCreate={savingCreate}
          savingEdit={savingEdit}
          importingId={importingId}
          newRow={newRow}
          editRow={editRow}
          onChangeNewRow={handleChangeNewRow}
          onChangeEditRow={handleChangeEditRow}
          onSaveCreate={handleSaveCreate}
          onCancelCreate={handleCancelCreate}
          onStartEdit={handleStartEdit}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onImportFile={handleImportFile}
          onDelete={handleDelete}
        />

        {/* MESSAGES */}
        {error && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="border-l-4 border-red-500 px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-sm text-slate-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {importErrors.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="border-l-4 border-red-500 px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-700 mb-2">Import thất bại:</div>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                    {importErrors.map((err, index) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="border-l-4 border-green-500 px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-slate-700 font-medium">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}