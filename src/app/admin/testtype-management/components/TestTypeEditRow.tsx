import { TestTypeEditRowProps } from "@/app/admin/testtype-management/types";

export default function TestTypeEditRow({
  item,
  editRow,
  savingEdit,
  onChangeEditRow,
  onSaveEdit,
  onCancelEdit,
}: TestTypeEditRowProps) {
  return (
    <tr className="bg-amber-50/70">
      <td className="px-6 py-5 font-semibold text-amber-700">#{item.id}</td>

      <td className="px-6 py-5 text-sm text-slate-500">
        {item.code ? (
          <span className="rounded-lg bg-slate-100 px-3 py-1 font-mono text-xs">
            {item.code}
          </span>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>

      <td className="px-6 py-5">
        <input
          value={editRow.name}
          onChange={(e) => onChangeEditRow("name", e.target.value)}
          placeholder="Nhập tên test type"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </td>

      <td className="px-6 py-5">
        <input
          value={editRow.description}
          onChange={(e) => onChangeEditRow("description", e.target.value)}
          placeholder="Nhập mô tả"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </td>

      <td className="px-6 py-5">
        <input
          type="number"
          min={1}
          value={editRow.totalQuestions}
          onChange={(e) => onChangeEditRow("totalQuestions", e.target.value)}
          placeholder="Số câu hỏi"
          className="w-28 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </td>

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
            onClick={() => onSaveEdit(item.id)}
            disabled={savingEdit}
            className="rounded-xl bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {savingEdit ? "Đang lưu..." : "Lưu"}
          </button>

          <button
            onClick={onCancelEdit}
            disabled={savingEdit}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Hủy
          </button>
        </div>
      </td>
    </tr>
  );
}