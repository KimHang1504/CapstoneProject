import { StatusBadge } from "./StatusBadge";

export function OrderCard({ orders }: any) {
  return (
    <div className="p-5 rounded-2xl shadow-md bg-white space-y-3">
      <h3 className="font-semibold text-lg">Đơn quảng cáo</h3>

      {orders.map((o: any) => (
        <div
          key={o.id}
          className="p-3 rounded-xl border border-gray-200 flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{o.packageName}</p>
            <p className="text-sm text-gray-500">
              {o.pricePaid} VNĐ
            </p>
          </div>

          <StatusBadge status={o.status} />
        </div>
      ))}
    </div>
  );
}