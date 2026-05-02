import {
    Wallet,
    CircleCheckBig,
    CircleX,
} from "lucide-react";
import { getSettlementSummary } from "@/api/venue/settlement/api";
import { formatCurrency } from "@/utils/formatCurrency";

export default async function SettlementSummary() {
    const s = await getSettlementSummary();

    const amountCards = [
        {
            label: "Chờ đối soát",
            value: formatCurrency(s.pendingAmount),
            count: s.pendingCount,
            icon: Wallet,
            note: "giao dịch đang chờ",

            accent: "bg-violet-500",
            text: "text-violet-700",
            dot: "bg-violet-500",
        },
        {
            label: "Đã thanh toán",
            value: formatCurrency(s.paidAmount),
            count: s.paidCount,
            icon: CircleCheckBig,
            note: "giao dịch hoàn tất",

            accent: "bg-green-500",
            text: "text-green-700",
            dot: "bg-green-500",
        },
        {
            label: "Đã huỷ",
            value: formatCurrency(s.cancelledAmount),
            count: s.cancelledCount,
            icon: CircleX,
            note: "giao dịch đã huỷ",
            accent: "bg-red-500",
            text: "text-red-700",
            dot: "bg-red-500",
        },
    ];

    return (
        <section className="relative space-y-6 overflow-hidden">

            <div className="relative">
                <h2 className="text-2xl font-bold text-slate-900">
                    Đối soát voucher
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Tổng tiền nhận được từ voucher theo từng trạng thái.
                </p>
            </div>

            <div className="relative grid grid-cols-3 gap-5">
                {amountCards.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className="rounded-3xl border border-gray-200 p-4 transition duration-300 hover:-translate-y-1 hover:bg-white/65"
                        >
                            <div className="    flex items-center justify-between">
                                <div className={`h-1.5 w-14 rounded-full bg-linear-to-r ${item.accent}`} />
                                <div className="rounded-2xl border border-white/70 bg-white/70">
                                    <Icon className={`h-5 w-5 ${item.text}`} />
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                                    {item.value}
                                </p>
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-slate-200/70 pt-4">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
                                    {item.note}
                                </div>
                                <span className="text-lg font-semibold text-slate-800">
                                    {item.count}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}