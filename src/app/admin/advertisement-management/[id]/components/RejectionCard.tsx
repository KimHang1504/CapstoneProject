
export function RejectionCard({ history }: any) {
    function formatDate(date: string) {
        return new Date(date).toLocaleDateString("vi-VN");
    }
    return (
        <div className="p-5 rounded-2xl shadow-md bg-white space-y-3">
            <h3 className="font-semibold text-lg">Lịch sử từ chối</h3>

            {history === null && (
                <p className="text-gray-500">Chưa có lịch sử từ chối</p>
            )}

            {history.map((h: any, i: number) => (
                <div key={i} className="border-l-2 pl-3">
                    <p className="text-sm text-gray-500">
                        {formatDate(h.rejectedAt)} - {h.rejectedBy}
                    </p>
                    <p>
                        {h.reason || "Không có lý do"}
                    </p>
                </div>
            ))}
        </div>
    );
}