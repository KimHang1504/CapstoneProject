import { TestTypeRowProps } from "@/app/admin/testtype-management/types";
import Link from "next/link";
import { Edit2, Upload } from "lucide-react";

export default function TestTypeRow({
  item,
  isCreating,
  editingId,
  importingId,
  onStartEdit,
  onImportFile,
}: TestTypeRowProps) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150">
      <td className="px-4 py-4">
        <span className="text-sm font-semibold text-slate-700">#{item.id}</span>
      </td>

      <td className="px-4 py-4">
        {item.code ? (
          <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-slate-700">
            {item.code}
          </span>
        ) : (
          <span className="text-sm text-slate-400">-</span>
        )}
      </td>

      <td className="px-4 py-4">
        <Link
          href={`/admin/testtype-management/${item.id}`}
          className="text-sm font-semibold text-slate-800 hover:text-slate-600 transition-colors duration-150 hover:underline underline-offset-2"
        >
          {item.name}
        </Link>
      </td>

      <td className="px-4 py-4">
        <span className="text-sm text-slate-600">{item.description}</span>
      </td>

      <td className="px-4 py-4">
        <span className="text-sm font-medium text-slate-700">{item.totalQuestions}</span>
      </td>

      <td className="px-4 py-4">
        <span className="inline-flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
          v{item.currentVersion}
        </span>
      </td>

      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            item.isActive
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-slate-50 text-slate-600 border border-slate-200"
          }`}
        >
          {item.isActive ? "Hoạt động" : "Không hoạt động"}
        </span>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onStartEdit(item)}
            disabled={isCreating || editingId !== null}
            className="group inline-flex items-center gap-1.5 px-3 py-2 bg-slate-400 text-white text-sm font-medium rounded-lg hover:bg-slate-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Sửa</span>
          </button>

          <label className="cursor-pointer group">
            <input
              type="file"
              accept=".csv"
              className="hidden"
              disabled={importingId === item.id}
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                onImportFile(item.id, file);
                e.currentTarget.value = "";
              }}
            />

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm ${
                importingId === item.id
                  ? "bg-slate-300 text-white cursor-not-allowed"
                  : "bg-slate-500 text-white hover:bg-slate-600 hover:shadow"
              }`}
            >
              {importingId === item.id ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                  <span>Đang nhập...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Nhập</span>
                </>
              )}
            </span>
          </label>
        </div>
      </td>
    </tr>
  );
}