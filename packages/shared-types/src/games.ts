export type PenaltySpot = 'TL' | 'TR' | 'C' | 'BL' | 'BR';

export interface PenaltyTarget {
  readonly id: PenaltySpot;
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly radius: number;
}

export type TeamIdentifier = 'TEAM_1' | 'TEAM_2';

export interface GameScoreState {
  readonly team1Name: string;
  readonly team2Name: string;
  readonly team1Score: number;
  readonly team2Score: number;
  readonly currentTurn: TeamIdentifier;
}

export type GoldLootType = 'GOLD' | 'MULT' | 'SWAP' | 'STEAL' | 'TRAP';

export interface GoldChestItem {
  readonly id: number;
  readonly type: GoldLootType;
  readonly value: number;
  readonly label: string;
  readonly opened: boolean;
}

export type BossSpellType = 'FIREBALL' | 'LIGHTNING' | 'FROST';

export interface GameAnswerFeedback {
  readonly isCorrect: boolean;
  readonly teamId: TeamIdentifier;
  readonly durationMs: number;
  readonly questionIndex: number;
}
