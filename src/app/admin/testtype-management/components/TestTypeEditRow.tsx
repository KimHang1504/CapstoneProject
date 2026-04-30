import { TestTypeEditRowProps } from "@/app/admin/testtype-management/types";
import { Save, X } from "lucide-react";

export default function TestTypeEditRow({
  item,
  editRow,
  savingEdit,
  onChangeEditRow,
  onSaveEdit,
  onCancelEdit,
}: TestTypeEditRowProps) {
  return (
    <tr className="bg-slate-50 border-b border-slate-200">
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
        <input
          value={editRow.name}
          onChange={(e) => onChangeEditRow("name", e.target.value)}
          placeholder="Nhập tên test type"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
        />
      </td>

      <td className="px-4 py-4">
        <input
          value={editRow.description}
          onChange={(e) => onChangeEditRow("description", e.target.value)}
          placeholder="Nhập mô tả"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
        />
      </td>

      <td className="px-4 py-4">
        <input
          type="number"
          min={1}
          value={editRow.totalQuestions}
          onChange={(e) => onChangeEditRow("totalQuestions", e.target.value)}
          placeholder="Số câu hỏi"
          className="w-28 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
        />
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
            onClick={() => onSaveEdit(item.id)}
            disabled={savingEdit}
            className="group cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-linear-to-r from-violet-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {savingEdit ? (
              <>
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Lưu</span>
              </>
            )}
          </button>

          <button
            onClick={onCancelEdit}
            disabled={savingEdit}
            className="group cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 border border-slate-300 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-violet-50 hover:border-violet-300 transition-all duration-200 disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" />
            <span>Hủy</span>
          </button>
        </div>
      </td>
    </tr>
  );
}