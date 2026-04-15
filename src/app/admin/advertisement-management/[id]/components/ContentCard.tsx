export function ContentCard({ content }: { content: string }) {
  return (
    <div className="p-5 rounded-2xl shadow-md bg-white">
      <h3 className="font-semibold text-lg mb-2">Nội dung quảng cáo</h3>
      <p className="whitespace-pre-line text-gray-700">{content}</p>
    </div>
  );
}