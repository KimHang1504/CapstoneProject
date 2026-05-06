'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, XCircle, TrendingDown, TrendingUp, Tag } from 'lucide-react';
import { getVenueTagAnalysis } from '@/api/venue/location/tag-analysis-api';
import { VenueTagAnalysis } from '@/api/venue/location/tag-analysis-type';

interface TagAnalysisWarningProps {
    venueId: number;
}

export default function TagAnalysisWarning({ venueId }: TagAnalysisWarningProps) {
    const [analysis, setAnalysis] = useState<VenueTagAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    type MessageType = 'GOOD' | 'WARNING' | 'POOR' | 'NO_DATA';

    const getMessageType = (analysis: VenueTagAnalysis): MessageType => {
        const msg = analysis.summary.overallMessage;

        if (msg.includes('Chưa đủ dữ liệu')) return 'NO_DATA';
        if (msg.includes('Tất cả tags đều phù hợp')) return 'GOOD';
        if (analysis.summary.poorTags.length > 0) return 'POOR';
        return 'WARNING';
    };

    const uiMap = {
        GOOD: {
            border: 'border-emerald-200 bg-emerald-50',
            text: 'text-emerald-700',
            subText: 'text-emerald-600',
            icon: <TrendingUp size={16} />,
            iconColor: 'text-emerald-500',
            accent: 'bg-emerald-500',
        },
        WARNING: {
            border: 'border-amber-200 bg-amber-50',
            text: 'text-amber-700',
            subText: 'text-amber-600',
            icon: <AlertTriangle size={16} />,
            iconColor: 'text-amber-500',
            accent: 'bg-amber-500',
        },
        POOR: {
            border: 'border-red-200 bg-red-50',
            text: 'text-red-700',
            subText: 'text-red-600',
            icon: <XCircle size={16} />,
            iconColor: 'text-red-500',
            accent: 'bg-red-500',
        },
        NO_DATA: {
            border: 'border-gray-200 bg-gray-50',
            text: 'text-gray-700',
            subText: 'text-gray-500',
            icon: <AlertTriangle size={16} />,
            iconColor: 'text-gray-400',
            accent: 'bg-gray-400',
        },
    };

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setIsLoading(true);
                const response = await getVenueTagAnalysis(venueId);
                console.log('Fetched tag analysis:', response.data);
                setAnalysis(response.data);
            } catch (err) {
                console.error('Error fetching tag analysis:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalysis();
    }, [venueId]);

    if (isLoading) {
        return (
            <div className="bg-gray-50 rounded-xl p-3 animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
        );
    }

    if (!analysis) return null;

    const messageType = getMessageType(analysis);
    
    // Ẩn component nếu không có đủ dữ liệu
    if (messageType === 'NO_DATA') return null;
    
    const ui = uiMap[messageType];

    const hasWarnings = analysis.tagAnalysis.some(tag => tag.status === 'POOR' || tag.status === 'WARNING');

    return (
        <div className="space-y-3">
            {/* Most Popular Tag Suggestion - card riêng biệt */}
            {analysis.mostPopularTag && (
                <div className="rounded-xl border border-blue-200 bg-blue-50">
                    <div className="py-3 px-4">
                        <div className="flex items-start gap-2.5">
                            <Tag size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm text-blue-900">
                                        Gợi ý tag phổ biến
                                    </span>
                                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium border border-blue-200">
                                        {analysis.mostPopularTag.tagName}
                                    </span>
                                </div>
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    {analysis.mostPopularTag.message}
                                </p>
                                <div className="mt-1.5 flex items-center gap-3 text-xs text-blue-600">
                                    <span>{analysis.mostPopularTag.count}/{analysis.totalReviews} khách hàng</span>
                                    <span className="font-semibold">{analysis.mostPopularTag.matchRate}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Warning box - chỉ hiển thị nếu có tags cần cảnh báo */}
            {hasWarnings && (
            <div className={`relative overflow-hidden rounded-xl border ${ui.border}`}>
            <div className={`absolute left-0 top-0 h-full w-1 ${ui.accent}`} />

            <div className="py-3 px-4">
                <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 flex-shrink-0 ${ui.iconColor}`}>
                        {ui.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <p className={`text-sm font-semibold ${ui.text}`}>
                                    {analysis.summary.overallMessage}
                                </p>

                                {analysis.summary.impactMessage && (
                                    <p className={`text-xs mt-1 ${ui.subText}`}>
                                        {analysis.summary.impactMessage}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className={`flex items-center gap-1 text-xs font-medium flex-shrink-0 ${ui.subText}`}
                            >
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                {isExpanded ? 'Ẩn' : 'Chi tiết'}
                            </button>
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-2.5">
                        {analysis.tagAnalysis
                            .filter(tag => tag.status === 'POOR' || tag.status === 'WARNING')
                            .map((tag, index) => (
                                <div key={index} className="bg-white rounded-lg p-2.5 border border-gray-200">
                                    <div className="flex items-center justify-between gap-3 mb-1.5">
                                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                            {tag.status === 'POOR' ? (
                                                <TrendingDown size={14} className="text-red-500 flex-shrink-0" />
                                            ) : (
                                                <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
                                            )}
                                            <span className="font-medium text-sm text-gray-900 truncate">{tag.tag}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded font-semibold flex-shrink-0 ${
                                            tag.status === 'POOR'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {tag.matchRate}%
                                        </span>
                                    </div>

                                    <p className="text-xs text-gray-600 mb-2 leading-relaxed">{tag.message}</p>

                                    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                                        <div
                                            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                                                tag.status === 'POOR'
                                                    ? 'bg-gradient-to-r from-red-500 to-red-600'
                                                    : 'bg-gradient-to-r from-amber-400 to-amber-500'
                                            }`}
                                            style={{ width: `${tag.matchRate}%` }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">
                                           {tag.matchedCount}/{tag.totalReviews} khách hàng đồng ý với tag này
                                        </span>
                                        {tag.status === 'POOR' && (
                                            <span className="text-red-600 font-medium">Nên xóa</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
            )}
        </div>
    );
}