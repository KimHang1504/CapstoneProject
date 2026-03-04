export const MOODS = [
  "vui",
  "buồn",
  "tức giận",
  "bất ngờ",
  "bối rối",
  "khó chịu",
  "bình tĩnh",
  "sợ hãi",
] as const;

export type Mood = (typeof MOODS)[number];
