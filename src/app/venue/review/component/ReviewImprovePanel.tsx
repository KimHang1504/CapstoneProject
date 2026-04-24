"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Lightbulb, RefreshCw } from "lucide-react";

import { buildVenueReviewImprovePrompt } from "@/api/ai/venue-review-improvement-prompt";
import { Review, ReviewSummary } from "@/api/venue/review/type";
import { generateText } from "@/utils/ai";

type Props = {
  venueId: number;
  venueName?: string;
  venueDescription?: string;
  reviews: Review[];
  summary: ReviewSummary;
};

type ImproveResult = {
  summary: string;
  improvements: string[];
  priorityActions: string[];
};

type OpenAIImprovePayload = {
  summary?: string;
  improvements?: string[];
  priorityActions?: string[];
};

const parseFallbackList = (content?: string): string[] => {
  if (!content) return [];

  return content
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 8);
};

const normalizeJsonString = (content: string): string => {
  let clean = content.trim();

  if (clean.startsWith("```json")) clean = clean.slice(7);
  if (clean.startsWith("```")) clean = clean.slice(3);
  if (clean.endsWith("```")) clean = clean.slice(0, -3);

  return clean.trim();
};

export default function ReviewImprovePanel({
  venueId,
  venueName,
  venueDescription,
  reviews,
  summary,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImproveResult | null>(null);

  const reviewContents = useMemo(() => {
    return reviews
      .map((review) => review.content?.trim())
      .filter((content): content is string => Boolean(content));
  }, [reviews]);

  const fetchImprove = useCallback(async () => {
    if (!reviewContents.length) {
      setResult({
        summary: "Chua du du lieu review de de xuat cai thien.",
        improvements: [],
        priorityActions: [],
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const prompt = buildVenueReviewImprovePrompt({
        venueId,
        venueName,
        venueDescription,
        averageRating: summary.averageRating,
        totalReviews: summary.totalReviews,
        reviews: reviewContents,
      });

      const aiRawContent = await generateText(prompt);

      if (!aiRawContent) {
        throw new Error("Khong nhan duoc phan hoi tu AI.");
      }

      const normalized = normalizeJsonString(aiRawContent);
      const parsed = JSON.parse(normalized) as OpenAIImprovePayload;

      const summaryText =
        parsed.summary ||
        "Da phan tich review va tao de xuat cai thien cho venue.";

      const improvements =
        parsed.improvements?.filter(Boolean) ||
        parseFallbackList(aiRawContent);

      const priorityActions =
        parsed.priorityActions?.filter(Boolean) || improvements.slice(0, 3);

      setResult({
        summary: summaryText,
        improvements,
        priorityActions,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Khong the tao de xuat cai thien luc nay.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [
    reviewContents,
    summary.averageRating,
    summary.totalReviews,
    venueDescription,
    venueId,
    venueName,
  ]);

  useEffect(() => {
    fetchImprove();
  }, [fetchImprove]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lightbulb size={18} className="text-amber-500" />
            <p className="text-sm font-semibold text-gray-800">AI Improve cho Venue</p>
          </div>

          <button
            onClick={fetchImprove}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Lam moi
          </button>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Du lieu dau vao: {reviewContents.length} review co noi dung.
        </p>
      </div>

      {isLoading && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Dang phan tich review va tao de xuat...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!isLoading && !error && result && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Tong quan van de</p>
            <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">De xuat cai thien</p>
            {result.improvements.length ? (
              <ul className="space-y-2">
                {result.improvements.map((item, index) => (
                  <li key={`${item}-${index}`} className="text-sm text-gray-700">
                    {index + 1}. {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Chua co de xuat chi tiet.</p>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Uu tien 7 ngay toi</p>
            {result.priorityActions.length ? (
              <ul className="space-y-2">
                {result.priorityActions.map((item, index) => (
                  <li key={`${item}-${index}`} className="text-sm text-gray-700">
                    {index + 1}. {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Chua co hanh dong uu tien.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
