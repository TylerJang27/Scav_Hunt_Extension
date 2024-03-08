import { ClueConfig, HuntConfig } from "src/types/hunt_config";

export type HuntSource = "Preset" | "Upload" | "URL";

export type ClueDisplayMode = "Tab" | "Overlay"; // Legacy is tab. New default is Overlay.

export interface UserConfig {
  // since 1.1.0
  displayMode: ClueDisplayMode;
}

export interface Progress {
  sourceType: HuntSource;
  huntConfig: HuntConfig;
  maxProgress: number;
  currentProgress: number;
  // since 1.1.0
  userConfig: UserConfig;
}

export interface SomeProgress {
  sourceType?: HuntSource;
  huntConfig?: HuntConfig;
  maxProgress?: number;
  currentProgress?: number;
  // since 1.1.0
  userConfig?: UserConfig;
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
