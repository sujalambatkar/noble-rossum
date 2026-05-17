export const F1_POINTS = {
  1: 25,
  2: 18,
  3: 15,
  4: 12,
  5: 10,
  6: 8,
  7: 6,
  8: 4,
  9: 2,
  10: 1,
} as const;

export function getPointsForRank(rank: number | null): number {
  if (rank === null || rank < 1 || rank > 10) return 0;
  return F1_POINTS[rank as keyof typeof F1_POINTS] || 0;
}

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
