import { getSettlementDetail } from "@/api/venue/settlement/api";
import { formatCurrency } from "@/utils/formatCurrency";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

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
      return { label: "Chờ đối soát", color: "violet" };
    case "PAID":
      return { label: "Đã thanh toán", color: "emerald" };
    case "CANCELLED":
      return { label: "Đã huỷ", color: "rose" };
    default:
      return { label: status, color: "slate" };
  }
};

function Operator({ symbol }: { symbol: string }) {
  return (
    <div className="flex items-center justify-center">
      <span className="text-slate-400 text-base md:text-lg font-semibold">
        {symbol}
      </span>
    </div>
  );
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const data = await getSettlementDetail(Number(id));
  const statusMeta = getStatusMeta(data.status);

  console.log("Settlement Detail:", data);

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Đối soát cho {data.voucherTitle}
          </h1>
          <p className="text-sm text-slate-500">
            #{data.settlementId}
          </p>
        </div>

        <StatusBadge meta={statusMeta} />
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">

          {/* GENERAL */}
          <Card title="Thông tin chung">
            <Row label="Mã voucher" value={data.voucherItemCode} />
            <Row label="Tên thành viên đổi" value={data.memberName || "--"} />
          </Card>

          {/* FINANCE */}
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3">

            <FinanceCard
              label="Tổng tiền"
              value={formatCurrency(data.grossAmount)}
            />

            <Operator symbol="−" />

            <FinanceCard
              label="Hoa hồng"
              value={formatCurrency(data.commissionAmount)}
            />

            <Operator symbol="=" />

            <FinanceCard
              label="Thực nhận"
              value={formatCurrency(data.netAmount)}
              highlight
            />
          </div>

        </div>

        {/* RIGHT - TIMELINE */}
        <div className="relative">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />

          <div className="space-y-6">
            <TimelineItem label="Tạo" value={formatDateTime(data.createdAt)} />
            <TimelineItem label="Sử dụng" value={formatDateTime(data.usedAt)} />
            <TimelineItem label="Khả dụng" value={formatDateTime(data.availableAt)} />
            <TimelineItem label="Thanh toán" value={formatDateTime(data.paidAt)} />
            <TimelineItem label="Cập nhật" value={formatDateTime(data.updatedAt)} />
          </div>
        </div>
      </div>

      {/* NOTE */}
      <div className="rounded-2xl border border-purple-300 bg-purple-100 p-4">
        <p className="text-xs uppercase text-slate-500 mb-1">Ghi chú</p>
        <p className="text-sm text-slate-700">
          {data.note || "--"}
        </p>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-purple-300 bg-white p-5 space-y-4">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}

function FinanceCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 border ${highlight
        ? "bg-violet-50 border-violet-200"
        : "bg-white border-slate-200"
        }`}
    >
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p
        className={`text-lg font-semibold ${highlight ? "text-violet-700" : "text-slate-900"
          }`}
      >
        {value}
      </p>
    </div>
  );
}

function TimelineItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-6 flex justify-center">
        <div className="w-2 h-2 mt-2 rounded-full bg-slate-400" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ meta }: any) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${meta.color}-100 text-${meta.color}-700`}>
      {meta.label}
    </span>
  );
}