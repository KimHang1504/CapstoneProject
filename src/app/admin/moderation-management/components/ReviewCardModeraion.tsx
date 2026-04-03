'use client';

import { useState } from "react";
import {
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  Image as ImageIcon
} from "lucide-react";

export function ReviewCardModeration({ review, onApprove, onReject }: any) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-4 hover:shadow-sm transition">

      {/* LEFT: IMAGE */}
      <div className="w-28 h-28 shrink-0">
        {review.imageUrls?.[0] ? (
          <div
            className="relative w-full h-full rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => setPreview(review.imageUrls[0])}
          >
            <img
              src={review.imageUrls[0]}
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

      {/* CENTER */}
      <div className="flex flex-col flex-1 gap-2">

        {/* AI ALERT */}
        <div className="flex items-center gap-2 text-xs bg-yellow-50 border border-yellow-200 text-yellow-800 px-2 py-1 rounded w-fit">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="font-medium">
            {"AI nghi ngờ nội dung"}
          </span>
        </div>

        {/* CONTENT */}
        <p className="text-sm text-slate-800 line-clamp-2 leading-relaxed">
          {review.content}
        </p>

        {/* USER */}
        <div className="flex items-center gap-2">
          <img
            src={review.member.avatarUrl}
            className="w-7 h-7 rounded-full"
          />
          <div className="text-xs text-slate-600">
            <span className="font-medium text-slate-800">
              {review.member.displayName}
            </span>
            {" • "}
            <span className="text-red-500">
              {review.member.violationCount ?? 0} vi phạm
            </span>
          </div>
        </div>

        {/* META */}
        <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">

          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500" />
            {review.rating}
          </div>

          {review.venue && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {review.venue.venueName}
            </div>
          )}

          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {new Date(review.createdAt).toLocaleString("vi-VN")}
          </div>
        </div>
      </div>

      {/* RIGHT: ACTION */}
      <div className="flex flex-col gap-2 shrink-0">

        <button
          onClick={onApprove}
          className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
        >
          <CheckCircle className="w-4 h-4" />
          Duyệt
        </button>

        <button
          onClick={onReject}
          className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
        >
          <XCircle className="w-4 h-4" />
          Từ chối
        </button>
      </div>

      {/* PREVIEW */}
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