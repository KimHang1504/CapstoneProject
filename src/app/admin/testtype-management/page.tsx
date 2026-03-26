"use client";

import {
  createTestType,
  getAllTestTypes,
  importQuestionsForTestType,
  updateTestType,
} from "@/api/admin/testtype/api";
import { TestType } from "@/api/admin/testtype/type";
import { useEffect, useState } from "react";
import { TestTypeRowForm } from "./types";
import TestTypeTable from "@/app/admin/testtype-management/components/TestTypeTable";

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Loại bài test</h1>
            <p className="mt-1 text-sm text-slate-500">
              Tổng cộng: {items.length} loại bài test
            </p>
          </div>

          <button
            onClick={handleCreateRow}
            disabled={isCreating || editingId !== null}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Tạo mới
          </button>
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
        />

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {importErrors.length > 0 && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <div className="mb-2 font-semibold">Import thất bại:</div>
            <ul className="list-disc space-y-1 pl-5">
              {importErrors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}