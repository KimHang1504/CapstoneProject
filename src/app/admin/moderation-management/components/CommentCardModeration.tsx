'use client';

import { CheckCircle, XCircle, CornerDownRight } from "lucide-react";
import { ModerationComment } from "@/api/admin/aiModeration/type";

interface Props {
    comment: ModerationComment;
    onApprove: () => void;
    onReject: () => void;
}

export function CommentCardModeration({ comment, onApprove, onReject }: Props) {
    const author = comment.author || {
        fullName: "Ẩn danh",
        avatar: "/default-avatar.png"
    };

    return (
        <div
            className="bg-white border rounded-xl p-4 shadow-sm space-y-3"
            style={{ marginLeft: `${(comment.level - 1) * 32}px` }}
        >
            {/* USER */}
            <div className="flex items-center gap-3">
                <img
                    src={author.avatar}
                    className="w-9 h-9 rounded-full object-cover"
                />

                <div>
                    <p className="text-sm font-semibold text-slate-800">
                        {author.fullName}
                    </p>

                    {comment.replyToMember && (
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            <CornerDownRight className="w-3 h-3" />
                            trả lời {comment.replyToMember.fullName}
                        </p>
                    )}
                </div>
            </div>

            {/* CONTENT */}
            <p className="text-sm text-slate-700 leading-relaxed">
                {comment.content}
            </p>

            {/* AI FLAG
            {comment.flaggedReason && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-md inline-block">
                    ⚠️ {comment.flaggedReason} ({comment.aiConfidence ?? 0}%)
                </div>
            )} */}

            {/* FOOTER */}
            <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-400">
                    {new Date(comment.createdAt).toLocaleString("vi-VN")}
                </span>

                <div className="flex gap-2">
                    <button
                        onClick={onApprove}
                        className="flex items-center cursor-pointer gap-1 px-3 py-1.5 text-xs rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                    >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Cho qua
                    </button>

                    <button
                        onClick={onReject}
                        className="flex items-center cursor-pointer gap-1 px-3 py-1.5 text-xs rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                    >
                        <XCircle className="w-3.5 h-3.5" />
                        Chặn
                    </button>
                </div>
            </div>
        </div>
    );
}