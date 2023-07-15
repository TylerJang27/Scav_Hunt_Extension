import {
  BulkError,
  ConfigError,
  InvalidIndexError,
  MissingFieldError,
  MissingValueError,
  SUPPORTED_VERSIONS,
  UnsupportedVersionError,
  XORFieldsError,
} from "../types/errors";
import { ClueConfig, HuntConfig } from "../types/hunt_config";
import { nonNull } from "./helpers";
import { Decrypt, Encrypt, wrapDecrypt, wrapEncrypt } from "./encrypt";

  "https://images.unsplash.com/photo-1583425921686-c5daf5f49e4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1031&q=80";

const ValidateRequiredField = (
  value: any,
  fieldName: string,
  index?: number
) => {
  if (!nonNull(value)) {
    throw new MissingFieldError(fieldName, index);
  }
  return value;
};

const ValidateRequiredNonEmptyField = (
  value: any,
  fieldName: string,
  index?: number
) => {
  if (!nonNull(value)) {
    throw new MissingFieldError(fieldName, index);
  }
  if (value === "") {
    throw new MissingValueError(fieldName, index);
  }
  return value;
};

const ValidateXORFields = (
  value1: any,
  fieldName1: string,
  value2: any,
  fieldName2: string,
  index?: number
) => {
  if (
    (!Boolean(value1) && !Boolean(value2)) ||
    (Boolean(value1) && Boolean(value2))
  ) {
    throw new XORFieldsError(value1, fieldName1, value2, fieldName2, index);
  }
};

const ValidateVersion = (value: any) => {
  if (!nonNull(value)) {
    throw new MissingFieldError("version");
  } else if (!SUPPORTED_VERSIONS.includes(value)) {
    throw new UnsupportedVersionError(value);
  }
  return value;
};

const ParseClue = (
  { id, url, text, html, image, alt, interactive }: ClueConfig,
  index: number
): ClueConfig => {
  const ret = {
    id: ValidateRequiredNonEmptyField(id, "id", index),
    url: ValidateRequiredNonEmptyField(url, "url", index),
    text: text,
    html: html,
    image: image,
    alt: alt,
    interactive: interactive,
  };

  ValidateXORFields(text, "text", html, "html", index);

  // Validate clue config
  if (interactive) {
    ValidateRequiredNonEmptyField(interactive?.key, "interactive.key", index);
  }

  return ret;
};

const ValidateClues = (clues: ClueConfig[]) => {
  let index = 1;
  clues.forEach((clue) => {
    if (clue.id != index) {
      throw new InvalidIndexError(clue.id, index);
    }
    index++;
  });
};

// TODO: TYLER TEST WITH BAD TYPE INPUTS
const ParseHuntOptions = ({
  name,
  description,
  version,
  author,
  encrypted = false,
  background = DEFAULT_BACKGROUND,
  options = { silent: false },
  beginning,
}: HuntConfig): HuntConfig => ({
  name: ValidateRequiredNonEmptyField(name, "name"),
  description: ValidateRequiredField(description, "description"),
  version: ValidateVersion(version),
  author: ValidateRequiredField(author, "author"),
  encrypted: encrypted,
  background: background,
  options: options,
  beginning: ValidateRequiredNonEmptyField(beginning, "beginning"),
  clues: [],
});

export const ParseConfig = (object: any) => {
  // Parse clues
  if (!object.clues || object.clues.length === 0) {
    throw new MissingValueError("clues");
  }

  const [_index, clues, errors] = object.clues.reduce(
    (
      [index, clueAccumulator, errorAccumulator]: [
        number,
        ClueConfig[],
        ConfigError[]
      ],
      clue: any
    ) => {
      try {
        return [
          index + 1,
          clueAccumulator.concat(ParseClue(clue, index++)),
          errorAccumulator,
        ];
      } catch (error) {
        if (error instanceof ConfigError) {
          return [index + 1, clueAccumulator, errorAccumulator.concat(error)];
        }
        throw error;
      }
    },
    [0, [], []]
  );

  // Errors at this point are high enough priority that we throw so users can resolve them.
  if (errors.length) {
    throw new BulkError(errors);
  }

  try {
    // Parse hunt config
    const huntConfig: HuntConfig = ParseHuntOptions(object);
    ValidateClues(clues);
    huntConfig.clues = clues;

    // Throw bulk error, config errors first
    if (errors.length) {
      throw new BulkError(errors);
    }
    return huntConfig;
  } catch (error) {
    // Throw bulk error with clue config errors
    if (error instanceof ConfigError) {
      throw new BulkError([error].concat(errors));
    }
    throw error;
  }
};

export const DecryptClue = (clue: ClueConfig, encrypted: boolean, secretKey: string) => ({
  /* Decoded fields */
  id: clue.id,
  /* Encoded fields */
  url: Decrypt(clue.url, encrypted, secretKey),
  text: wrapDecrypt(clue.text, encrypted, secretKey),
  html: wrapDecrypt(clue.html, encrypted, secretKey),
  image: wrapDecrypt(clue.image, encrypted, secretKey),
  alt: wrapDecrypt(clue.alt, encrypted, secretKey),
  interactive: clue.interactive
    ? {
        prompt: wrapDecrypt(clue.interactive.prompt, encrypted, secretKey),
        key: clue.interactive.key,
      }
    : undefined,
});

export const EncryptClue = (clue: ClueConfig, encrypted: boolean, secretKey: string) => ({
  /* Decoded fields */
  id: clue.id,
  /* Encoded fields */
  url: Encrypt(clue.url, encrypted, secretKey),
  text: wrapEncrypt(clue.text, encrypted, secretKey),
  html: wrapEncrypt(clue.html, encrypted, secretKey),
  image: wrapEncrypt(clue.image, encrypted, secretKey),
  alt: wrapEncrypt(clue.alt, encrypted, secretKey),
  interactive: clue.interactive
    ? {
        prompt: wrapEncrypt(clue.interactive.prompt, encrypted, secretKey),
        key: clue.interactive.key,
      }
    : undefined,
});
