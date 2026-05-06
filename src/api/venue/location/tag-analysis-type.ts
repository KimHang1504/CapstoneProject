export interface TagAccuracyDetail {
  tag: string;
  tagType: string;
  status: 'GOOD' | 'WARNING' | 'POOR' | 'INSUFFICIENT_DATA';
  severity: 'NONE' | 'MEDIUM' | 'HIGH';
  totalReviews: number;
  matchedCount: number;
  unmatchedCount: number;
  matchRate: number;
  message: string;
  recommendation: string | null;
}

export interface TagAnalysisSummary {
  goodTags: string[];
  warningTags: string[];
  poorTags: string[];
  actionRequired: boolean;
  overallMessage: string;
  impactMessage?: string | null;
}

export interface SuggestedTag {
  tagName: string;
  count: number;
  matchRate: number;
  message: string;
}

export interface VenueTagAnalysis {
  venueId: number;
  venueName: string;
  totalReviews: number;
  tagAnalysis: TagAccuracyDetail[];
  summary: TagAnalysisSummary;
  mostPopularTag?: SuggestedTag | null;
}

export interface GetVenueTagAnalysisResponse {
  message: string;
  code: number;
  data: VenueTagAnalysis;
  traceId?: string;
  timestamp?: string;
}
