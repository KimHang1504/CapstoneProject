"use client";

type MissingCitizenPopupProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
};

export default function MissingCitizenPopup({
  open,
  onClose,
  onConfirm,
  title = "Thiếu thông tin CCCD",
  description = "Bạn chưa cập nhật CCCD (mặt trước và mặt sau). Bạn có muốn cập nhật ngay không?",
}: MissingCitizenPopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

        <p className="mt-3 text-sm text-gray-600">{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
          >
            Để sau
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-violet-600 cursor-pointer px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            Cập nhật ngay
          </button>
        </div>
      </div>
    </div>
  );
}