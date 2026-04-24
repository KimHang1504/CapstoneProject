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

export interface VenueTagAnalysis {
  venueId: number;
  venueName: string;
  overallMatchRate: number;
  totalReviews: number;
  tagAnalysis: TagAccuracyDetail[];
  summary: TagAnalysisSummary;
}

export interface GetVenueTagAnalysisResponse {
  message: string;
  code: number;
  data: VenueTagAnalysis;
  traceId?: string;
  timestamp?: string;
}
