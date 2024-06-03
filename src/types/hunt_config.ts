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
  text?: string; // TODO: TYLER SANITIZE THIS WHEN WE RENDER THIS
  markdown?: string;
  // Deprecated in v1.2.0
  // html?: string;
  // URL or file path
  image?: string; // TODO: TYLER AUDIT/SANITIZE THIS WHEN WE RENDER THIS
  alt?: string;
  interactive?: IntractiveConfig;
}

// TODO: OTHER OPTIONS, SUCH AS REQUIRE IN-ORDER, SHOW_PROGRESS
export interface HuntOptions {
  silent: boolean;
  inOrder: boolean;
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
  // TODO(Tyler): Do we want to support markdown for beginning text?
  beginning: string;
  clues: ClueConfig[];
}
