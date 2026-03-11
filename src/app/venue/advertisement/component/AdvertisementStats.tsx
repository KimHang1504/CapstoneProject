type Props = {
    total: number;
    active: number;
    pending: number;
    draft: number;
};

export default function AdvertisementStats({
    total,
    active,
    pending,
    draft
}: Props) {
    return (
        <div className="grid grid-cols-4 gap-4 mb-6">

            <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">Tổng</p>
                <p className="text-2xl font-bold">{total}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">Đang chạy</p>
                <p className="text-2xl font-bold text-green-600">{active}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">Chờ duyệt</p>
                <p className="text-2xl font-bold text-yellow-600">{pending}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">Bản nháp</p>
                <p className="text-2xl font-bold text-gray-600">{draft}</p>
            </div>

        </div>
    );
}