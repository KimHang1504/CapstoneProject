'use client';

import { useState } from "react";
import { MessageSquare, FileText, Star } from "lucide-react";
import { ReviewCardModeration } from "./components/ReviewCardModeraion";
import PostModeration from "./components/PostModeration";
import ReviewCard from "@/app/venue/review/component/ReviewCard";
import ReviewModeration from "./components/ReviewModeration";
import CommentModeration from "./components/CommentModeration";

type TabType = 'REVIEW' | 'POST' | 'COMMENT';

export default function AIModerationPage() {
  const [tab, setTab] = useState<TabType>('POST');

  const tabs = [
    { key: 'POST', label: 'Bài viết', icon: FileText },
    { key: 'REVIEW', label: 'Đánh giá', icon: Star },
    { key: 'COMMENT', label: 'Bình luận', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto p-6 space-y-5">

        {/* HEADER */}
        <h1 className="text-2xl font-semibold text-slate-800">
          Kiểm duyệt AI
        </h1>

        {/* TABS */}
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 w-fit">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;

            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key as TabType)}
                className={`flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div>
          {tab === 'POST' && <PostModeration />}
          {tab === 'REVIEW' && <ReviewModeration />}
          {tab === 'COMMENT' && <CommentModeration />}
        </div>
      </div>
    </div>
  );
}