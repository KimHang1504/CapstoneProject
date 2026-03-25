export default function CommentSnapshot({ snapshot }: any) {
  const data = snapshot.data;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">

      {/* Info */}
      <div className="flex justify-between text-sm text-gray-500">
        <span>Author ID: {data.AuthorId}</span>
        <span>{new Date(data.CreatedAt).toLocaleString()}</span>
      </div>

      {/* Content */}
      <p className="text-gray-800 text-base">
        {data.Content}
      </p>

      {/* Meta */}
      <div className="text-sm text-gray-600 space-y-1">
        <p><strong>Post ID:</strong> {data.PostId}</p>
        <p><strong>Reply to:</strong> {data.ParentId ?? "Root comment"}</p>
        <p><strong>Target Member:</strong> {data.TargetMemberId}</p>
      </div>

      {/* Footer */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>Status: {data.Status}</span>
        <span>
          Snapshot at: {new Date(snapshot.capturedAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}