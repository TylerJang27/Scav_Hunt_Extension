import { ClueConfig, HuntConfig } from "src/types/hunt_config";
import { DEFAULT_BACKGROUND } from "src/utils/parse";
import { Encrypt } from "src/utils/encrypt";

const testHuntName = "Test Hunt";
/**
 * This file contains helper methods used in testing to create hunts and clues
 */
export const coalesce = (val: any, ret: any) => {
  if (val !== undefined) {
    return ret;
  }
  return undefined;
};

export const makeClue = (
  url: string,
  text: string,
  image?: string,
  alt?: string,
): ClueConfig => ({
  id: -1,
  url,
  text,
  image,
  alt,
});

export const makeEncryptedClue = (
  url: string,
  text: string,
  image?: string,
  alt?: string,
): ClueConfig =>
  makeClue(
    Encrypt(url, true, testHuntName),
    Encrypt(text, true, testHuntName),
    coalesce(image, Encrypt(image ?? "", true, testHuntName)),
    coalesce(image, Encrypt(alt ?? "", true, testHuntName)),
  );

export const makeInteractiveClue = (
  url: string,
  text: string,
  prompt: string,
  key: string,
  image?: string,
  alt?: string,
): ClueConfig => ({
  id: -1,
  url,
  text,
  image,
  alt,
  interactive: {
    prompt,
    key,
  },
});

export const makeEncryptedInteractiveClue = (
  url: string,
  text: string,
  prompt: string,
  key: string,
  image?: string,
  alt?: string,
): ClueConfig =>
  makeInteractiveClue(
    Encrypt(url, true, testHuntName),
    Encrypt(text, true, testHuntName),
    Encrypt(prompt, true, testHuntName),
    Encrypt(key, true, testHuntName),
    coalesce(image, Encrypt(image ?? "", true, testHuntName)),
    coalesce(image, Encrypt(alt ?? "", true, testHuntName)),
  );

export const makeHunt = (
  clues: ClueConfig[],
  silent: boolean = false,
): HuntConfig => ({
  name: testHuntName,
  description: "A Test Hunt",
  version: "0.1",
  author: "Tester",
  encrypted: false,
  background: DEFAULT_BACKGROUND,
  options: { silent },
  beginning: "The beginning clue",
  clues: clues.reduce(
    (ret: ClueConfig[], current: ClueConfig, index: number) => {
      return ret.concat({ ...current, id: index + 1 });
    },
    [],
  ),
});

export const makeEncryptedHunt = (
  clues: ClueConfig[],
  silent: boolean = false,
): HuntConfig => ({
  name: testHuntName,
  description: "A Test Hunt",
  version: "0.1",
  author: "Tester",
  encrypted: true,
  background: DEFAULT_BACKGROUND,
  options: { silent },
  beginning: "The beginning clue",
  clues: clues.reduce(
    (ret: ClueConfig[], current: ClueConfig, index: number) => {
      return ret.concat({ ...current, id: index + 1 });
    },
    [],
  ),
});

export const sampleClues = [
  makeClue("google.com/1", "First clue"),
  makeClue("google.com/2", "Second clue", "clue_2_url"),
  makeClue("google.com/3", "Third clue", "clue_3_url", "alt_text_3"),
  makeInteractiveClue("google.com/4", "Fourth clue", "Enter four", "four"),
  makeInteractiveClue(
    "google.com/5",
    "Fifth clue",
    "Enter five",
    "five",
    "clue_5_url",
    "alt_text_5",
  ),
];

export const sampleEncryptedClues = [
  makeEncryptedClue("google.com/1", "First clue"),
  makeEncryptedClue("google.com/2", "Second clue", "clue_2_url"),
  makeEncryptedClue("google.com/3", "Third clue", "clue_3_url", "alt_text_3"),
  makeEncryptedInteractiveClue(
    "google.com/4",
    "Fourth clue",
    "Enter four",
    "four",
  ),
  makeEncryptedInteractiveClue(
    "google.com/5",
    "Fifth clue",
    "Enter five",
    "five",
    "clue_5_url",
    "alt_text_5",
  ),
];

// TODO: TYLER MAKE MORE CLUES WITH REGEX URLS TOO

export const sampleHunt = makeHunt(sampleClues);
export const sampleEncryptedHunt = makeEncryptedHunt(sampleEncryptedClues);
export const sampleSilentHunt = makeHunt(sampleClues, true);
