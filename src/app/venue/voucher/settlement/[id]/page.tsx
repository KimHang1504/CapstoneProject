import { getSettlementDetail } from "@/api/venue/settlement/api";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const formatCurrency = (value: number) =>
  `${new Intl.NumberFormat("vi-VN").format(value)} đ`;

const formatDateTime = (value: string | null) => {
  if (!value) return "--";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const getStatusMeta = (status: string) => {
  switch (status) {
    case "PENDING":
      return {
        label: "Chờ đối soát",
        className: "border border-violet-200 bg-violet-50 text-violet-700",
      };
    case "PAID":
      return {
        label: "Đã thanh toán",
        className: "border border-pink-200 bg-pink-50 text-pink-700",
      };
    case "CANCELLED":
      return {
        label: "Đã huỷ",
        className: "border border-rose-200 bg-rose-50 text-rose-700",
      };
    default:
      return {
        label: status,
        className: "border border-slate-200 bg-slate-50 text-slate-700",
      };
  }
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const data = await getSettlementDetail(Number(id));
  const statusMeta = getStatusMeta(data.status);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div>
        <h1 className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-2xl font-bold text-transparent">
          Chi tiết đối soát #{data.settlementId}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Thông tin chi tiết giao dịch voucher
        </p>
      </div>

      {/* CARD */}
      <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-[0_10px_40px_rgba(168,85,247,0.08)] space-y-6">
        
        {/* TOP */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Voucher</p>
            <p className="text-lg font-semibold text-slate-900">
              {data.voucherTitle}
            </p>
          </div>

          <span
            className={`rounded-full px-4 py-1 text-sm font-semibold ${statusMeta.className}`}
          >
            {statusMeta.label}
          </span>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Info label="Mã voucher item" value={data.voucherItemCode} />
          <Info label="Voucher Item ID" value={String(data.voucherItemId)} />
          <Info label="Khách hàng" value={data.memberName} />

          <Info label="Tổng tiền" value={formatCurrency(data.grossAmount)} />
          <Info label="Hoa hồng" value={formatCurrency(data.commissionAmount)} />
          <Info
            label="Thực nhận"
            value={formatCurrency(data.netAmount)}
            highlight
          />

          <Info label="Used at" value={formatDateTime(data.usedAt)} />
          <Info label="Available at" value={formatDateTime(data.availableAt)} />
          <Info label="Paid at" value={formatDateTime(data.paidAt)} />

          <Info label="Created at" value={formatDateTime(data.createdAt)} />
          <Info label="Updated at" value={formatDateTime(data.updatedAt)} />
        </div>

        {/* NOTE */}
        <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4">
          <p className="text-sm font-medium text-slate-600 mb-1">Ghi chú</p>
          <p className="text-sm text-slate-700">
            {data.note || "--"}
          </p>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p
        className={`text-sm ${
          highlight
            ? "font-semibold text-violet-700"
            : "font-medium text-slate-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}