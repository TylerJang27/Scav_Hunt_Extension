export const SAMPLE_DIR = "res";

export interface IntractiveConfig {
  /* Encrypted fields */
  prompt?: string;
  // Only decrypted during final check
  key: string;
}

export interface ClueConfig {
  /* Unencrypted fields */
  // Required to be ordered, starting from 1
  id: number;

  /* Encrypted fields */
  // URL or regex
  url: string;
  text?: string;
  html?: string;
  // URL or file path
  image?: string;
  alt?: string;
  interactive?: IntractiveConfig;
}

// TODO: OTHER OPTIONS, SUCH AS REQUIRE IN-ORDER, SHOW_PROGRESS
// TODO: SHOULD THE HTML OPTION INCLUDE A NOTICE?
export interface HuntOptions {
  silent: boolean;
}

export interface HuntConfig {
  name: string;
  description: string;
  // Supported versions are currently: 1
  version: string;
  author: string;
  encrypted: boolean;
  background: string;
  options: HuntOptions;
  beginning: string;
  clues: ClueConfig[];
}
