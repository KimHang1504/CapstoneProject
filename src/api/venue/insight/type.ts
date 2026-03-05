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
  moods: {
    moodName: string;
    count: number;
  }[];
}

export interface InsightData {
  timeframe: Timeframe;
  generatedAt: string;
  topSearches: TopSearch[];
  hotMoods: HotMood[];
  popularPreferences: any[];
  moodTrendsByMonth: MoodTrend[];
}