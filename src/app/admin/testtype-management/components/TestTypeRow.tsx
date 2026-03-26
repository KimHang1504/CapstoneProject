    import { TestTypeRowProps } from "@/app/admin/testtype-management/types";
import Link from "next/link";

export default function TestTypeRow({
  item,
  isCreating,
  editingId,
  importingId,
  onStartEdit,
  onImportFile,
}: TestTypeRowProps) {
  return (
    <tr className="hover:bg-slate-50">
      <td className="px-6 py-5 font-semibold text-slate-900">#{item.id}</td>

      <td className="px-6 py-5 text-sm text-slate-700">
        {item.code ? (
          <span className="rounded-lg bg-slate-100 px-3 py-1 font-mono text-xs">
            {item.code}
          </span>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>

      <td className="px-6 py-5 font-semibold">
        <Link
          href={`/admin/testtype-management/${item.id}`}
          className="cursor-pointer text-gray-800 transition hover:text-violet-500 hover:underline hover:decoration-violet-500 underline-offset-4"
        >
          {item.name}
        </Link>
      </td>

      <td className="px-6 py-5 text-slate-600">{item.description}</td>

      <td className="px-6 py-5 text-slate-700">{item.totalQuestions}</td>

      <td className="px-6 py-5 text-slate-700">v{item.currentVersion}</td>

      <td className="px-6 py-5">
        <span
          className={`inline-flex rounded-full px-4 py-1.5 text-sm font-semibold ${
            item.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {item.isActive ? "Hoạt động" : "Không hoạt động"}
        </span>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onStartEdit(item)}
            disabled={isCreating || editingId !== null}
            className="rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Sửa
          </button>

          <label className="cursor-pointer">
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                onImportFile(item.id, file);
                e.currentTarget.value = "";
              }}
            />

            <span
              className={`inline-flex rounded-xl px-3 py-2 text-sm font-semibold text-white ${
                importingId === item.id
                  ? "bg-slate-400"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {importingId === item.id ? "Đang nhập..." : "Nhập"}
            </span>
          </label>
        </div>
      </td>
    </tr>
  );
}