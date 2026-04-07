import { TestTypeTableProps } from "@/app/admin/testtype-management/types";
import TestTypeCreateRow from "./TestTypeCreateRow";
import TestTypeEditRow from "./TestTypeEditRow";
import TestTypeRow from "./TestTypeRow";
import { ListChecks } from "lucide-react";

export default function TestTypeTable({
  items,
  loading,
  isCreating,
  editingId,
  savingCreate,
  savingEdit,
  importingId,
  newRow,
  editRow,
  onChangeNewRow,
  onChangeEditRow,
  onSaveCreate,
  onCancelCreate,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onImportFile,
}: TestTypeTableProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      {loading ? (
        <div className="px-6 py-16 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-600 mb-4"></div>
            <p className="text-sm font-medium text-slate-600">Đang tải dữ liệu...</p>
            <p className="text-xs text-slate-400 mt-1">Vui lòng đợi...</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-violet-600 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-violet-600 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-violet-600 uppercase tracking-wider">Tên</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-violet-600 uppercase tracking-wider">Mô tả</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-violet-600 uppercase tracking-wider">Số câu hỏi</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-violet-600 uppercase tracking-wider">Phiên bản</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-violet-600 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold text-violet-600 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {items.length === 0 && !isCreating ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <ListChecks className="w-16 h-16 mb-3 text-slate-300" strokeWidth={1.5} />
                      <p className="text-sm font-medium text-slate-600">Chưa có loại bài test nào</p>
                      <p className="text-xs text-slate-400 mt-1">Hãy tạo loại bài test đầu tiên</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {items.map((item) => {
                    const isEditing = editingId === item.id;

                    if (isEditing) {
                      return (
                        <TestTypeEditRow
                          key={item.id}
                          item={item}
                          editRow={editRow}
                          savingEdit={savingEdit}
                          onChangeEditRow={onChangeEditRow}
                          onSaveEdit={onSaveEdit}
                          onCancelEdit={onCancelEdit}
                        />
                      );
                    }

                    return (
                      <TestTypeRow
                        key={item.id}
                        item={item}
                        isCreating={isCreating}
                        editingId={editingId}
                        importingId={importingId}
                        onStartEdit={onStartEdit}
                        onImportFile={onImportFile}
                      />
                    );
                  })}

                  {isCreating && (
                    <TestTypeCreateRow
                      newRow={newRow}
                      savingCreate={savingCreate}
                      onChangeNewRow={onChangeNewRow}
                      onSaveCreate={onSaveCreate}
                      onCancelCreate={onCancelCreate}
                    />
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}