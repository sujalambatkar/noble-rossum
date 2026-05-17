export const TOTAL_SEASON_ROUNDS = 73;
export const MAX_POINTS_PER_ROUND = 25;

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
  projectedFinal: number;
  isEliminated: boolean;
}

/**
 * Win-probability model for a fixed-length season.
 *
 * - Players whose maximum possible final (current + 25 × remaining) cannot reach
 *   the current leader's total are eliminated → 0% chance.
 * - Among eligible players, probability is weighted by their PROJECTED final
 *   total (current + avgPPR × remaining), with a power exponent that gives
 *   the projected leader a meaningfully larger share without zeroing out
 *   close challengers.
 * - If the season is already over (no rounds remaining), the current leader
 *   gets 100% and everyone else 0%.
 */
export function calculateAnalytics(
  players: PlayerStats[],
  roundsPlayed: number,
  totalRounds: number = TOTAL_SEASON_ROUNDS
): AnalyticsData[] {
  if (players.length === 0) return [];

  const roundsRemaining = Math.max(0, totalRounds - roundsPlayed);
  const leaderPoints = Math.max(...players.map((p) => p.totalPoints));
  const leaderIds = players
    .filter((p) => p.totalPoints === leaderPoints)
    .map((p) => p.id);

  // Compute projection + eligibility
  const enriched = players.map((player) => {
    const pointsToFirst = leaderPoints - player.totalPoints;
    const roundsNeededToFirst =
      player.avgPointsPerRound > 0
        ? Math.ceil(pointsToFirst / player.avgPointsPerRound)
        : null;
    const maxPossibleFinal =
      player.totalPoints + MAX_POINTS_PER_ROUND * roundsRemaining;
    const projectedFinal =
      player.totalPoints + player.avgPointsPerRound * roundsRemaining;
    const isEliminated =
      roundsRemaining === 0
        ? !leaderIds.includes(player.id)
        : maxPossibleFinal < leaderPoints;
    return {
      player,
      pointsToFirst: Math.max(0, pointsToFirst),
      roundsNeededToFirst,
      projectedFinal,
      isEliminated,
    };
  });

  // Compute probabilities
  let probabilities: number[];
  if (roundsRemaining === 0) {
    probabilities = enriched.map((e) =>
      leaderIds.includes(e.player.id) ? 100 / leaderIds.length : 0
    );
  } else {
    const POWER = 3; // amplifies leader's share without zeroing rivals
    const weights = enriched.map((e) =>
      e.isEliminated ? 0 : Math.pow(Math.max(0, e.projectedFinal), POWER)
    );
    const sum = weights.reduce((a, b) => a + b, 0);
    probabilities =
      sum > 0 ? weights.map((w) => (w / sum) * 100) : weights.map(() => 0);
  }

  return enriched.map((e, i) => ({
    ...e.player,
    pointsToFirst: e.pointsToFirst,
    roundsNeededToFirst: e.roundsNeededToFirst,
    winProbability: Math.round(probabilities[i] * 100) / 100,
    projectedFinal: Math.round(e.projectedFinal * 10) / 10,
    isEliminated: e.isEliminated,
  }));
}

export function calculateAveragePointsPerRound(
  totalPoints: number,
  roundsParticipated: number
): number {
  return roundsParticipated > 0 ? totalPoints / roundsParticipated : 0;
}
