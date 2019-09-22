export type Difficulty = {
  rows: number;
  columns: number;
  bombs: number;
};

export type Cell = {
  id: string;
  playerRevealed: boolean;
  endRevealed: boolean;
  isFlagged: boolean;
  value: 'bomb' | number;
};

export type Grid = Cell[][];
