export default function VenueSnapshot({ snapshot }: any) {
  const data = snapshot.data;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-800">
          {data.Name}
        </h3>
        <span className="text-xs text-gray-400">
          ID: {data.Id}
        </span>
      </div>

      {/* Image */}
      {data.CoverImage && (
        <img
          src={data.CoverImage}
          alt="venue"
          className="w-full h-48 object-cover rounded-xl border"
        />
      )}

      {/* Info */}
      <div className="text-sm text-gray-600 space-y-1">
        <p><strong>Địa chỉ:</strong> {data.Address}</p>
        <p><strong>Danh mục:</strong> {data.Category}</p>
        <p><strong>Email:</strong> {data.Email}</p>
        <p><strong>SĐT:</strong> {data.PhoneNumber}</p>
      </div>

      {/* Description */}
      <p className="text-gray-800 text-base">
        {data.Description}
      </p>

      {/* Footer */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>Trạng thái: {data.status == "PENDING" ? "Đang chờ duyệt" :
          data.status == "ACTIVE" ? "Đang hoạt động" :
            "Đã ẩn"}
        </span>
        <span>
          Ghi nhận lúc: {new Date(snapshot.capturedAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}