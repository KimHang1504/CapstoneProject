export default function UserSnapshot({ snapshot }: any) {
  const data = snapshot.data;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-800">
          {data.FullName}
        </h3>
        <span className="text-xs text-gray-400">
          ID người dùng: {data.UserId}
        </span>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-600 space-y-1">
        <p><strong>Giới tính:</strong> {data.Gender}</p>
        <p><strong>Tình trạng mối quan hệ:</strong> {data.RelationshipStatus}</p>
      </div>

      {/* Bio */}
      <p className="text-gray-800 text-base italic">
        {data.Bio || "Không có bio"}
      </p>

      {/* Footer */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>Ngày tạo: {new Date(data.CreatedAt).toLocaleDateString()}</span>
        <span>
          Ghi nhận lúc: {new Date(snapshot.capturedAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}