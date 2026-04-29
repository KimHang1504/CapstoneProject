import { FileText } from "lucide-react";

export function ContentCard({ content }: { content: string }) {
  return (
    <div className="p-6 rounded-2xl shadow-md bg-white border border-slate-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <FileText className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="font-semibold text-lg text-slate-800">Mô tả quảng cáo</h3>
      </div>
      <div className="prose prose-sm max-w-none">
        <p className="whitespace-pre-line text-gray-700 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}