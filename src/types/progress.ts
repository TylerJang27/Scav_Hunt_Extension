import { ClueConfig, HuntConfig } from "src/types/hunt_config";

export type HuntSource = "Preset" | "Upload" | "URL";

export interface Progress {
  sourceType: HuntSource;
  huntConfig: HuntConfig;
  maxProgress: number;
  currentProgress: number;
  // TODO: TYLER DOES THIS NEED A SOURCEUPDATES?
}

export interface SomeProgress {
  sourceType?: HuntSource;
  huntConfig?: HuntConfig;
  maxProgress?: number;
  currentProgress?: number;
  // TODO: TYLER DOES THIS NEED A SOURCEUPDATES?
}

export interface SolvedOptions {
  encrypted: boolean;
  background: string;
}

/* Solved clue always has all information except the encrypted key decrypted*/
export interface SolvedClueWrapper {
  options: SolvedOptions;
  clue: ClueConfig;
}

export type ClueWorkerStatus = "Found" | "Invalid" | "Not Found";

export interface ClueWorkerUpdate {
  status: ClueWorkerStatus;
  solvedClueWrapper?: SolvedClueWrapper;
}
