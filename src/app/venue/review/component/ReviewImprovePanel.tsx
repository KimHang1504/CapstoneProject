"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { 
  Lightbulb, 
  RefreshCw, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Target,
  ListChecks
} from "lucide-react";

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

  // Remove markdown code blocks
  if (clean.startsWith("```json")) clean = clean.slice(7);
  if (clean.startsWith("```")) clean = clean.slice(3);
  if (clean.endsWith("```")) clean = clean.slice(0, -3);

  clean = clean.trim();

  // Find JSON object boundaries
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    clean = clean.substring(firstBrace, lastBrace + 1);
  }

  // Fix common JSON issues
  // Remove trailing commas before ] or }
  clean = clean.replace(/,(\s*[\]}])/g, '$1');
  
  // Fix missing commas between array elements (but be careful with commas in strings)
  // This is tricky, so we'll rely on the regex fallback if this fails

  return clean;
};

const safeJsonParse = (content: string): OpenAIImprovePayload | null => {
  // First attempt: standard JSON parse
  try {
    const normalized = normalizeJsonString(content);
    return JSON.parse(normalized) as OpenAIImprovePayload;
  } catch (error) {
    console.warn("Standard JSON parse failed, trying fallback extraction");
  }

  // Second attempt: Regex extraction fallback
  try {
    // Extract summary
    const summaryMatch = content.match(/"summary"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    
    // Extract improvements array (use [\s\S] instead of . with s flag)
    const improvementsMatch = content.match(/"improvements"\s*:\s*\[([\s\S]*?)\]\s*,?\s*"priorityActions"/);
    
    // Extract priorityActions array (use [\s\S] instead of . with s flag)
    const priorityMatch = content.match(/"priorityActions"\s*:\s*\[([\s\S]*?)\]\s*\}/);

    const extractArray = (arrayContent: string | undefined): string[] => {
      if (!arrayContent) return [];
      
      // Match quoted strings, handling escaped quotes
      const matches = arrayContent.match(/"((?:[^"\\]|\\.)*)"/g);
      if (!matches) return [];
      
      return matches
        .map(m => m.slice(1, -1)) // Remove surrounding quotes
        .map(s => s.replace(/\\"/g, '"').replace(/\\n/g, '\n')) // Unescape
        .filter(Boolean);
    };

    const result: OpenAIImprovePayload = {
      summary: summaryMatch?.[1]?.replace(/\\"/g, '"').replace(/\\n/g, '\n'),
      improvements: extractArray(improvementsMatch?.[1]),
      priorityActions: extractArray(priorityMatch?.[1]),
    };

    // Validate we got at least something
    if (result.summary || result.improvements?.length || result.priorityActions?.length) {
      console.log("Fallback extraction successful");
      return result;
    }

    return null;
  } catch (fallbackError) {
    console.error("Fallback parse error:", fallbackError);
    return null;
  }
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
      // Không hiển thị gì khi chưa có đủ dữ liệu
      setResult(null);
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
        throw new Error("Không nhận được phản hồi từ AI.");
      }

      const parsed = safeJsonParse(aiRawContent);

      if (!parsed) {
        throw new Error("Không thể phân tích dữ liệu từ AI.");
      }

      const summaryText =
        parsed.summary ||
        "Đã phân tích review và tạo đề xuất cải thiện cho venue.";

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
      const message = "AI đang quá tải, bạn quay lại sau nhé!";

      console.error(err); // dev xem
      setError(message);  // user xem

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
      {/* Header Card */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-sm border border-amber-200/50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Sparkles size={20} className="text-amber-500" />
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">AI Cải thiện cho Venue</p>
              <p className="text-xs text-gray-600 mt-0.5">
                Phân tích từ {reviewContents.length} review
              </p>
            </div>
          </div>

          <button
            onClick={fetchImprove}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-amber-200 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:border-amber-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin"></div>
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500" size={20} />
            </div>
            <p className="text-sm text-gray-600 font-medium">Đang phân tích review và tạo đề xuất...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900 mb-1">Có lỗi xảy ra</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {!isLoading && !error && result && (
        <div className="space-y-4">
          {/* Summary Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                <TrendingUp size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  Tổng quan vấn đề
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>
              </div>
            </div>
          </div>

          {/* Improvements Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-green-50 rounded-lg flex-shrink-0">
                <ListChecks size={20} className="text-green-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                Đề xuất cải thiện
              </h3>
            </div>
            
            {result.improvements.length ? (
              <div className="space-y-3 ml-11">
                {result.improvements.map((item, index) => (
                  <div 
                    key={`${item}-${index}`} 
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors group"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white border-2 border-green-200 flex items-center justify-center text-xs font-bold text-green-700 group-hover:border-green-400 transition-colors">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed flex-1 pt-0.5">{item}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 ml-11">Chưa có đề xuất chi tiết.</p>
            )}
          </div>

          {/* Priority Actions Card */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-sm border border-purple-200/50 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-white rounded-lg flex-shrink-0 shadow-sm">
                <Target size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  Ưu tiên 7 ngày tới
                </h3>
                <p className="text-xs text-gray-600 mt-1">Hành động quan trọng cần thực hiện ngay</p>
              </div>
            </div>
            
            {result.priorityActions.length ? (
              <div className="space-y-3 ml-11">
                {result.priorityActions.map((item, index) => (
                  <div 
                    key={`${item}-${index}`} 
                    className="flex items-start gap-3 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all group border border-purple-100"
                  >
                    <CheckCircle2 
                      size={20} 
                      className="text-purple-500 flex-shrink-0 mt-0.5 group-hover:text-purple-600 transition-colors" 
                    />
                    <p className="text-sm text-gray-700 leading-relaxed flex-1 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 ml-11">Chưa có hành động ưu tiên.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
