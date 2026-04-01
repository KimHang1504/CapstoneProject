"use client";

import {
  activateQuestionVersion,
  getTestTypeById,
  importQuestionsForTestType,
} from "@/api/admin/testtype/api";
import { TestTypeDetail } from "@/api/admin/testtype/type";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import TestTypeGeneralInfo from "./components/TestTypeGeneralInfo";
import TestTypeVersionList from "./components/TestTypeVersionList";

export default function TestTypeDetailPage() {
  const params = useParams();
  const id = useMemo(() => Number(params?.id), [params?.id]);

  const [item, setItem] = useState<TestTypeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [activatingVersion, setActivatingVersion] = useState<number | null>(null);
  const [actionMessage, setActionMessage] = useState("");

  const fetchDetail = async () => {
    if (!id || Number.isNaN(id)) {
      setError("ID không hợp lệ");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await getTestTypeById(id);
      setItem(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Không thể tải chi tiết loại bài test");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleImportFile = async (file: File | null) => {
    setError("");
    setSuccessMessage("");
    setImportErrors([]);

    if (!file || !item) return;

    try {
      setImporting(true);

      const res = await importQuestionsForTestType(item.id, file);
      const result = res.data;

      if (result.errors?.length > 0) {
        setImportErrors(result.errors);
      } else {
        setSuccessMessage(
          `Nhập thành công ${result.insertedQuestions}/${result.totalRows} câu hỏi`
        );
      }

      const detailRes = await getTestTypeById(item.id);
      setItem(detailRes.data);
    } catch (err: any) {
      console.error(err);

      const importResult = err?.data?.data ?? err?.data;

      if (importResult?.errors?.length > 0) {
        setImportErrors(importResult.errors);
        return;
      }

      setError(err?.message || "Nhập file thất bại");
    } finally {
      setImporting(false);
    }
  };

  const handleActivateVersion = async (version: number) => {
    if (!item) return;

    const confirmed = window.confirm(
      `Bạn có chắc muốn áp dụng phiên bản ${version} cho test type "${item.name}" không?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setActionMessage("");
      setActivatingVersion(version);

      const res = await activateQuestionVersion(item.id, version);

      setActionMessage(res.message || `Đã áp dụng phiên bản ${version} thành công`);
      await fetchDetail();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Không thể áp dụng phiên bản câu hỏi");
    } finally {
      setActivatingVersion(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500 shadow-sm">
            Đang tải dữ liệu...
          </div>
        </div>
      </div>
    );
  }

  if (error && !item) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-600 shadow-sm">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2">
              <Link
                href="/admin/testtype-management"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                ← Quay lại danh sách
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-slate-900">{item.name}</h1>
            <p className="mt-1 text-sm text-slate-500">
              Chi tiết loại bài test #{item.id}
            </p>
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                handleImportFile(file);
                e.currentTarget.value = "";
              }}
            />
            <span
              className={`inline-flex rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                importing ? "bg-slate-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {importing ? "Đang nhập..." : "Nhập câu hỏi"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TestTypeGeneralInfo item={item} />
          </div>

          <div>
            <TestTypeVersionList
              testTypeId={item.id}
              currentVersion={item.currentVersion}
              versions={item.versions}
              activatingVersion={activatingVersion}
              onActivate={handleActivateVersion}
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {actionMessage && (
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {actionMessage}
          </div>
        )}

        {importErrors.length > 0 && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <div className="mb-2 font-semibold">Nhập dữ liệu thất bại:</div>
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