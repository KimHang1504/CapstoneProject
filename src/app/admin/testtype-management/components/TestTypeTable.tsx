import { TestTypeTableProps } from "@/app/admin/testtype-management/types";
import TestTypeCreateRow from "./TestTypeCreateRow";
import TestTypeEditRow from "./TestTypeEditRow";
import TestTypeRow from "./TestTypeRow";

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
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {loading ? (
        <div className="px-6 py-16 text-center text-sm text-slate-500">
          Đang tải dữ liệu...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-sm font-semibold text-slate-700">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Tên</th>
                <th className="px-6 py-4">Mô tả</th>
                <th className="px-6 py-4">Số câu hỏi</th>
                <th className="px-6 py-4">Phiên bản</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
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
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}