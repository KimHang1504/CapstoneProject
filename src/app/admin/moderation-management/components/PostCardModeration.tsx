'use client';

import { useState } from "react";
import {
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Image as ImageIcon
} from "lucide-react";

export function PostCardModeration({ post, onApprove, onReject }: any) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-4 hover:shadow-sm transition">

      {/* LEFT: MEDIA */}
      <div className="w-28 h-28 shrink-0">
        {post.mediaPayload?.[0] ? (
          <div
            className="relative w-full h-full rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => setPreview(post.mediaPayload[0].url)}
          >
            <img
              src={post.mediaPayload[0].url}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">
            No Image
          </div>
        )}
      </div>

      {/* CENTER: CONTENT */}
      <div className="flex flex-col flex-1 gap-2">

        {/* AI ALERT (đặt lên đầu) */}
        <div className="flex items-center gap-2 text-xs bg-yellow-50 border border-yellow-200 text-yellow-800 px-2 py-1 rounded w-fit">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="font-medium">
            {"AI nghi ngờ nội dung"}
          </span>
        </div>

        {/* CONTENT */}
        <p className="text-sm text-slate-800 line-clamp-2 leading-relaxed">
          {post.content}
        </p>

        {/* USER */}
        <div className="flex items-center gap-2">
          <img
            src={post.author.avatar}
            className="w-7 h-7 rounded-full"
          />
          <div className="text-xs text-slate-600">
            <span className="font-medium text-slate-800">
              {post.author.fullName}
            </span>
            {" • "}
            <span className="text-red-500">
              {post.author.violationCount ?? 0} vi phạm
            </span>
          </div>
        </div>

        {/* META */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {post.locationName || "Không rõ"}
          </div>

          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {new Date(post.createdAt).toLocaleString("vi-VN")}
          </div>
        </div>
      </div>

      {/* RIGHT: ACTION (cố định) */}
      <div className="flex flex-col gap-2 shrink-0">

        <button
          onClick={onApprove}
          className="flex cursor-pointer items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
        >
          <CheckCircle className="w-4 h-4" />
          Cho qua
        </button>

        <button
          onClick={onReject}
          className="flex cursor-pointer items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
        >
          <XCircle className="w-4 h-4" />
          Chặn
        </button>
      </div>

      {/* IMAGE PREVIEW */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setPreview(null)}
        >
          <img
            src={preview}
            className="max-w-[90%] max-h-[85%] rounded-xl"
          />
        </div>
      )}
    </div>
  );
}