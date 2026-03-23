export type Timeframe = 'all' | 'today' | 'week' | 'month' | 'year';

export interface TopSearch {
  Keyword: string;
  Count: number;
  Percentage: number;
}

export interface HotMood {
  MoodTypeId: number;
  MoodName: string;
  Count: number;
  Percentage: number;
}

export interface MoodTrend {
  Month: string;
  MonthName: string;
  TotalCount: number;
  Moods: { MoodName: string; Count: number }[];
}

export interface InteractionBreakdown {
  Type: string;
  Count: number;
}

export interface TopVenueCategory {
  Category: string;
  TotalInteractions: number;
  UniqueUsers: number;
  InteractionBreakdown: InteractionBreakdown[];
}

export interface TopCheckInVenue {
  Id: number;
  Name: string;
  Category: string | null;
  CheckInCount: number;
  AverageRating: number;
  Status: string;
}

export interface FavoritesAndInteractions {
  TopVenueCategories: TopVenueCategory[];
  AdPerformanceByCategory: unknown[];
  TopCheckInVenues: TopCheckInVenue[];
  TotalCheckIns: number;
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
  Data: {
    Timeframe: Timeframe;
    GeneratedAt: string;
    TopSearches: TopSearch[];
    HotMoods: HotMood[];
    MoodTrendsByMonth: MoodTrend[];
    FavoritesAndInteractions: FavoritesAndInteractions;
  };
  TrendAnalysis: TrendAnalysis;
}
