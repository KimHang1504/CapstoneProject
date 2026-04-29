import { Receipt, DollarSign } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export function OrderCard({ orders }: any) {
  return (
    <div className="p-6 rounded-2xl shadow-md bg-white border border-slate-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-green-100 rounded-lg">
          <Receipt className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="font-semibold text-lg text-slate-800">Lịch sử thanh toán quảng cáo</h3>
        <span className="ml-auto px-3 py-1 text-sm font-medium bg-green-50 text-green-600 rounded-full">
          {orders?.length || 0} giao dịch
        </span>
      </div>

      {(!orders || orders.length === 0) && (
        <div className="text-center py-12 text-gray-400">
          <Receipt className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-medium">Chưa có giao dịch thanh toán nào</p>
        </div>
      )}

      <div className="space-y-3">
        {orders?.map((o: any) => (
          <div
            key={o.id}
            className="p-4 rounded-xl border border-slate-200 hover:border-purple-200 hover:bg-purple-50/30 transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <p className="font-semibold text-slate-800 mb-1">{o.packageName}</p>
                <div className="flex items-center gap-1.5 text-green-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-lg font-bold">
                    {o.pricePaid?.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
              <StatusBadge status={o.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}