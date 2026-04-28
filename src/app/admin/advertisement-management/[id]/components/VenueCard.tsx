import { MapPin } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export function VenueCard({ venues }: any) {
    function formatDate(date: string) {
        return new Date(date).toLocaleDateString("vi-VN");
    }

    return (
        <div className="p-6 rounded-2xl shadow-md bg-white border border-slate-100 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-800">Địa điểm áp dụng</h3>
                </div>
                <span className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-600 rounded-full">
                    {venues?.length || 0} địa điểm
                </span>
            </div>

            {/* Empty state */}
            {(!venues || venues.length === 0) && (
                <div className="text-center py-12 text-gray-400">
                    <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-medium">Chưa có địa điểm nào</p>
                </div>
            )}

            {/* Table */}
            {venues && venues.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-slate-700">Địa điểm</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-700">Bắt đầu</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-700">Kết thúc</th>
                                <th className="px-4 py-3 text-center font-semibold text-slate-700">Trạng thái</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {venues.map((v: any) => (
                                <tr
                                    key={v.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-4 py-3 font-medium text-slate-800">
                                        {v.venueName}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {formatDate(v.startDate)}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {formatDate(v.endDate)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <StatusBadge status={v.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}