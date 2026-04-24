'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, XCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { getVenueTagAnalysis } from '@/api/venue/location/tag-analysis-api';
import { VenueTagAnalysis } from '@/api/venue/location/tag-analysis-type';

interface TagAnalysisWarningProps {
    venueId: number;
}

export default function TagAnalysisWarning({ venueId }: TagAnalysisWarningProps) {
    const [analysis, setAnalysis] = useState<VenueTagAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setIsLoading(true);
                const response = await getVenueTagAnalysis(venueId);
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

    if (!analysis || !analysis.summary.actionRequired) {
        return null;
    }

    const hasPoorTags = analysis.summary.poorTags.length > 0;

    return (
        <div className={`relative overflow-hidden rounded-xl border ${
            hasPoorTags ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'
        }`}>
            <div className={`absolute left-0 top-0 h-full w-1 ${
                hasPoorTags ? 'bg-red-500' : 'bg-amber-500'
            }`} />

            <div className="py-3 px-4">
                <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 flex-shrink-0 ${hasPoorTags ? 'text-red-500' : 'text-amber-500'}`}>
                        {hasPoorTags ? <XCircle size={16} /> : <AlertTriangle size={16} />}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <p className={`text-sm font-semibold ${
                                    hasPoorTags ? 'text-red-700' : 'text-amber-700'
                                }`}>
                                    {analysis.summary.overallMessage}
                                </p>

                                {analysis.summary.impactMessage && (
                                    <p className={`text-xs mt-1 ${
                                        hasPoorTags ? 'text-red-600' : 'text-amber-600'
                                    }`}>
                                        {analysis.summary.impactMessage}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className={`flex items-center gap-1 text-xs font-medium flex-shrink-0 ${
                                    hasPoorTags ? 'text-red-600 hover:text-red-700' : 'text-amber-600 hover:text-amber-700'
                                }`}
                            >
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                {isExpanded ? 'Ẩn' : 'Chi tiết'}
                            </button>
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-2.5">
                        <p className="text-xs text-gray-500">
                            {analysis.totalReviews} đánh giá • Phù hợp chung: {analysis.overallMatchRate}%
                        </p>

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
                                                tag.status === 'POOR' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-amber-400 to-amber-500'
                                            }`}
                                            style={{ width: `${tag.matchRate}%` }}
                                        />
                                        {tag.matchRate > 0 && (
                                            <div
                                                className={`absolute inset-y-0 w-1 rounded-full ${
                                                    tag.status === 'POOR' ? 'bg-red-700' : 'bg-amber-600'
                                                }`}
                                                style={{ left: `${tag.matchRate}%`, transform: 'translateX(-50%)' }}
                                            />
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">
                                            {tag.matchedCount}/{tag.totalReviews} khách hài lòng
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
    );
}
