import { TestTypeCreateRowProps } from "@/app/admin/testtype-management/types";

export default function TestTypeCreateRow({
  newRow,
  savingCreate,
  onChangeNewRow,
  onSaveCreate,
  onCancelCreate,
}: TestTypeCreateRowProps) {
  return (
    <tr className="bg-blue-50/70">
      <td className="px-6 py-5 font-semibold text-blue-700">New</td>

      <td className="px-6 py-5 text-sm text-slate-400">Auto</td>

      <td className="px-6 py-5">
        <input
          value={newRow.name}
          onChange={(e) => onChangeNewRow("name", e.target.value)}
          placeholder="Nhập tên test type"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </td>

      <td className="px-6 py-5">
        <input
          value={newRow.description}
          onChange={(e) => onChangeNewRow("description", e.target.value)}
          placeholder="Nhập mô tả"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </td>

      <td className="px-6 py-5">
        <input
          type="number"
          min={1}
          value={newRow.totalQuestions}
          onChange={(e) => onChangeNewRow("totalQuestions", e.target.value)}
          placeholder="Số câu hỏi"
          className="w-28 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </td>

      <td className="px-6 py-5 text-slate-400">v0</td>

      <td className="px-6 py-5">
        <span className="inline-flex rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-semibold text-yellow-700">
          Nháp
        </span>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onSaveCreate}
            disabled={savingCreate}
            className="rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {savingCreate ? "Đang lưu..." : "Lưu"}
          </button>

          <button
            onClick={onCancelCreate}
            disabled={savingCreate}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Hủy
          </button>
        </div>
      </td>
    </tr>
  );
}