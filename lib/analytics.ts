export interface PlayerStats {
  id: string;
  name: string;
  totalPoints: number;
  wins: number;
  roundsParticipated: number;
  avgPointsPerRound: number;
}

export interface AnalyticsData extends PlayerStats {
  pointsToFirst: number;
  roundsNeededToFirst: number | null;
  winProbability: number;
}

export function calculateAnalytics(
  players: PlayerStats[],
  roundsRemaining: number = 60
): AnalyticsData[] {
  if (players.length === 0) return [];

  const leader = Math.max(...players.map((p) => p.totalPoints));
  const totalAvgPPR = players.reduce((sum, p) => sum + p.avgPointsPerRound, 0);

  return players.map((player) => {
    const pointsToFirst = leader - player.totalPoints;
    const roundsNeededToFirst =
      player.avgPointsPerRound > 0
        ? Math.ceil(pointsToFirst / player.avgPointsPerRound)
        : null;

    const winProbability =
      totalAvgPPR > 0
        ? (player.avgPointsPerRound / totalAvgPPR) *
          (player.avgPointsPerRound > 0 ? 100 : 0)
        : 0;

    return {
      ...player,
      pointsToFirst: Math.max(0, pointsToFirst),
      roundsNeededToFirst: roundsNeededToFirst,
      winProbability: Math.max(0, Math.round(winProbability * 100) / 100),
    };
  });
}

export function calculateAveragePointsPerRound(
  totalPoints: number,
  roundsParticipated: number
): number {
  return roundsParticipated > 0 ? totalPoints / roundsParticipated : 0;
}
