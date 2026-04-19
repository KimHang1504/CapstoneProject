import { StatusBadge } from "./StatusBadge";

export function VenueCard({ venues }: any) {
    function formatDate(date: string) {
        return new Date(date).toLocaleDateString("vi-VN");
    }

    return (
        <div className="p-5 rounded-2xl shadow-md bg-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Địa điểm áp dụng</h3>
                <span className="text-sm text-gray-500">
                    {venues?.length || 0} địa điểm
                </span>
            </div>

            {/* Empty state */}
            {(!venues || venues.length === 0) && (
                <div className="text-center py-6 text-gray-400 text-sm">
                    Chưa có địa điểm nào
                </div>
            )}

            {/* Table */}
            {venues && venues.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-gray-200">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Địa điểm</th>
                                {/* <th className="px-4 py-3 text-left font-medium">Ưu tiên</th> */}
                                <th className="px-4 py-3 text-left font-medium">Bắt đầu</th>
                                <th className="px-4 py-3 text-left font-medium">Kết thúc</th>
                                <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                            </tr>
                        </thead>

                        <tbody>
                            {venues.map((v: any) => (
                                <tr
                                    key={v.id}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    {/* Venue name */}
                                    <td className="px-4 py-3 font-medium text-gray-800">
                                        {v.venueName}
                                    </td>

                                    {/* Priority */}
                                    {/* <td className="px-4 py-3">
                                        <span className="px-2 py-1 rounded-lg bg-violet-50 text-violet-600 text-xs font-medium">
                                            {v.priorityScore}
                                        </span>
                                    </td> */}

                                    {/* Start */}
                                    <td className="px-4 py-3 text-gray-600">
                                        {formatDate(v.startDate)}
                                    </td>

                                    {/* End */}
                                    <td className="px-4 py-3 text-gray-600">
                                        {formatDate(v.endDate)}
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3">
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