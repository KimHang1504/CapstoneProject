import { TestTypeCreateRowProps } from "@/app/admin/testtype-management/types";
import { Save, X } from "lucide-react";

export default function TestTypeCreateRow({
  newRow,
  savingCreate,
  onChangeNewRow,
  onSaveCreate,
  onCancelCreate,
}: TestTypeCreateRowProps) {
  return (
    <tr className="bg-slate-50 border-b border-slate-200">
      <td className="px-4 py-4">
        <span className="text-sm font-semibold text-slate-600">New</span>
      </td>

      <td className="px-4 py-4">
        <span className="text-sm text-slate-400">Auto</span>
      </td>

      <td className="px-4 py-4">
        <input
          value={newRow.name}
          onChange={(e) => onChangeNewRow("name", e.target.value)}
          placeholder="Nhập tên test type"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
        />
      </td>

      <td className="px-4 py-4">
        <input
          value={newRow.description}
          onChange={(e) => onChangeNewRow("description", e.target.value)}
          placeholder="Nhập mô tả"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
        />
      </td>

      <td className="px-4 py-4">
        <input
          type="number"
          min={1}
          value={newRow.totalQuestions}
          onChange={(e) => onChangeNewRow("totalQuestions", e.target.value)}
          placeholder="Số câu hỏi"
          className="w-28 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
        />
      </td>

      <td className="px-4 py-4">
        <span className="inline-flex items-center text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">v0</span>
      </td>

      <td className="px-4 py-4">
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
          Nháp
        </span>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onSaveCreate}
            disabled={savingCreate}
            className="group inline-flex items-center gap-1.5 px-3 py-2 bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
          >
            {savingCreate ? (
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
            onClick={onCancelCreate}
            disabled={savingCreate}
            className="group inline-flex items-center gap-1.5 px-3 py-2 border border-slate-300 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" />
            <span>Hủy</span>
          </button>
        </div>
      </td>
    </tr>
  );
}