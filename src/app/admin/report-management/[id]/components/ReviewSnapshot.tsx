export default function ReviewSnapshot({ snapshot }: any) {
  const data = snapshot.data;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">

      {/* Info */}
      <div className="flex justify-between text-sm text-gray-500">
        <span>Member ID: {data.MemberId}</span>
        <span>{new Date(data.CreatedAt).toLocaleString()}</span>
      </div>

      {/* Rating */}
      <div className="text-yellow-500 font-semibold">
        ⭐ {data.Rating}/5
      </div>

      {/* Content */}
      <p className="text-gray-800 text-base">{data.Content}</p>

      {/* Images */}
      {data.ImageUrls?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {data.ImageUrls.map((url: string, index: number) => (
            <img
              key={index}
              src={url}
              alt="review"
              className="w-full h-40 object-cover rounded-xl border"
            />
          ))}
        </div>
      )}

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