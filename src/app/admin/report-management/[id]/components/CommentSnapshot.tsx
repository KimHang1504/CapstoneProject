export default function CommentSnapshot({ snapshot }: any) {
  const data = snapshot.data;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">

      {/* Info */}
      <div className="flex justify-between text-sm text-gray-500">
        <span>ID người dùng: {data.AuthorId}</span>
        <span>{new Date(data.CreatedAt).toLocaleString()}</span>
      </div>

      {/* Content */}
      <p className="text-gray-800 text-base">
        {data.Content}
      </p>

      {/* Meta */}
      <div className="text-sm text-gray-600 space-y-1">
        <p><strong>ID bài viết:</strong> {data.PostId}</p>
        <p><strong>ID bình luận cha:</strong> {data.ParentId ?? "Bình luận gốc"}</p>
        <p><strong>Người dùng bị nhắc đến:</strong> {data.TargetMemberId ?? "Không có"}</p>
      </div>

      {/* Footer */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>Trạng thái: {data.Status == "PUBLISHED" ? "Công khai" :
          data.status == "PENDING" ? "Chưa công khai" :
            data.status == "FLAGGED" ? "Bị gắn cờ" :
              "Đã ẩn"}
        </span>
        <span>
          Ghi nhận lúc: {new Date(snapshot.capturedAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}