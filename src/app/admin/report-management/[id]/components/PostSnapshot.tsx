export default function PostSnapshot({ snapshot }: any) {
  const data = snapshot.data;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">

      {/* Author + CreatedAt */}
      <div className="flex justify-between text-sm text-gray-500">
        <span>User ID: {data.AuthorId}</span>
        <span>{new Date(data.CreatedAt).toLocaleString()}</span>
      </div>

      {/* Content */}
      <p className="text-gray-800 text-base">{data.Content}</p>

      {/* Hashtags */}
      <div className="flex flex-wrap gap-2">
        {data.HashTags?.map((tag: string, idx: number) => (
          <span
            key={idx}
            className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Media */}
      {data.MediaPayload?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {data.MediaPayload.map((media: any, index: number) => (
            <div key={index} className="rounded-xl overflow-hidden border">
              {media.Type === "IMAGE" ? (
                <img
                  src={media.Url}
                  alt="media"
                  className="w-full h-40 object-cover"
                />
              ) : (
                <video
                  src={media.Url}
                  controls
                  className="w-full h-40 object-cover"
                />
              )}
            </div>
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