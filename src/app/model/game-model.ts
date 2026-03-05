export interface FrameEntity {
  index: number;
  roll1: number;
  roll2: number;
  score: number;
  status: FrameStatus;
}

export enum FrameStatus {
  NEW,
  ROLL1,
  ROLL2,
  STRIKE,
  SPARE,
  CLOSED
}
