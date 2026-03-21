export type Timeframe = 'all' | 'today' | 'week' | 'month' | 'year';

export interface TopSearch {
  keyword: string;
  count: number;
  percentage: number;
}

export interface HotMood {
  moodTypeId: number;
  moodName: string;
  count: number;
  percentage: number;
}

export interface MoodTrend {
  month: string;
  monthName: string;
  totalCount: number;
  moods: { moodName: string; count: number }[];
}

export interface InteractionBreakdown {
  type: string;
  count: number;
}

export interface TopVenueCategory {
  category: string;
  totalInteractions: number;
  uniqueUsers: number;
  interactionBreakdown: InteractionBreakdown[];
}

export interface TopCheckInVenue {
  id: number;
  name: string;
  category: string | null;
  checkInCount: number;
  averageRating: number;
  status: string;
}

export interface FavoritesAndInteractions {
  topVenueCategories: TopVenueCategory[];
  adPerformanceByCategory: unknown[];
  topCheckInVenues: TopCheckInVenue[];
  totalCheckIns: number;
}

export interface TrendKeyword {
  keyword: string;
  insight: string;
}

export interface DominantMood {
  mood: string;
  percentage: number;
  trend: string;
}

export interface TrendAnalysis {
  searchTrends: {
    summary: string;
    topKeywords: TrendKeyword[];
  };
  moodAnalysis: {
    dominantMoods: DominantMood[];
    monthlyTrend: { month: string; insight: string }[];
  };
  venuePreferences: {
    topCategories: { category: string; reason: string }[];
    userBehavior: string;
  };
  checkInInsights: {
    popularVenues: { name: string; appeal: string }[];
  };
  businessStrategy: {
    recommendations: string[];
    opportunities: string[];
  };
}

export interface InsightData {
  data: {
    timeframe: Timeframe;
    generatedAt: string;
    topSearches: TopSearch[];
    hotMoods: HotMood[];
    moodTrendsByMonth: MoodTrend[];
    favoritesAndInteractions: FavoritesAndInteractions;
  };
  trendAnalysis: TrendAnalysis;
}
