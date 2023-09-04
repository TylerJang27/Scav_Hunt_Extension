import { DEFAULT_BACKGROUND } from "src/providers/helpers";
import {
  BulkError,
  ConfigError,
  InvalidIndexError,
  MissingFieldError,
  MissingValueError,
  SUPPORTED_VERSIONS,
  UnsupportedVersionError,
  XORFieldsError,
} from "src/types/errors";
import { ClueConfig, HuntConfig } from "src/types/hunt_config";
import { Decrypt, Encrypt, wrapDecrypt, wrapEncrypt } from "src/utils/encrypt";
import { nonNull } from "src/utils/helpers";

const ValidateRequiredField = (
  value: any,
  fieldName: string,
  index?: number,
): any => {
  if (!nonNull(value)) {
    throw new MissingFieldError(fieldName, index);
  }
  return value;
};

const ValidateRequiredNonEmptyField = (
  value: any,
  fieldName: string,
  index?: number,
): any => {
  if (!nonNull(value)) {
    throw new MissingFieldError(fieldName, index);
  }
  if (value === "") {
    throw new MissingValueError(fieldName, index);
  }
  return value;
};

// trunk-ignore(eslint/@typescript-eslint/no-unused-vars)
const ValidateXORFields = (
  value1: any,
  fieldName1: string,
  value2: any,
  fieldName2: string,
  index?: number,
) => {
  if ((!value1 && !value2) || (Boolean(value1) && Boolean(value2))) {
    throw new XORFieldsError(value1, fieldName1, value2, fieldName2, index);
  }
};

const ValidateVersion = (value: string): string => {
  if (!nonNull(value)) {
    throw new MissingFieldError("version");
  } else if (!SUPPORTED_VERSIONS.includes(value)) {
    throw new UnsupportedVersionError(value);
  }
  return value;
};

export const ParseClue = (
  { id, url, text, html, image, alt, interactive }: ClueConfig,
  index?: number,
): ClueConfig => {
  const ret = {
    id: ValidateRequiredNonEmptyField(id, "id", index) as number,
    url: ValidateRequiredNonEmptyField(url, "url", index) as string,
    text: ValidateRequiredNonEmptyField(text, "text", index) as string,
    html: html,
    image: image,
    alt: alt,
    interactive: interactive,
  };

  // TODO: TYLER ONCE WE ADD MARKDOWN SUPPORT, WE SHOULD USE XOR HERE AND REMOVE text VALIDATION
  // ValidateXORFields(text, "text", html, "html", index);

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
  name: ValidateRequiredNonEmptyField(name, "name") as string,
  description: ValidateRequiredNonEmptyField(
    description,
    "description",
  ) as string,
  version: ValidateVersion(version),
  author: ValidateRequiredField(author, "author") as string,
  encrypted: encrypted,
  background: background,
  options: options,
  beginning: ValidateRequiredNonEmptyField(beginning, "beginning") as string,
  clues: [],
});

export const ParseConfig = (object: any) => {
  // Parse clues
  // trunk-ignore(eslint/@typescript-eslint/no-unsafe-member-access)
  if (!object.clues || object.clues.length === 0) {
    throw new MissingValueError("clues");
  }

  // trunk-ignore(eslint)
  const [_, clues, errors] = object.clues.reduce(
    (
      [index, clueAccumulator, errorAccumulator]: [
        number,
        ClueConfig[],
        ConfigError[],
      ],
      clue: ClueConfig,
    ) => {
      try {
        return [
          index + 1,
          clueAccumulator.concat(ParseClue(clue, index)),
          errorAccumulator,
        ];
      } catch (error) {
        if (error instanceof ConfigError) {
          return [index + 1, clueAccumulator, errorAccumulator.concat(error)];
        }
        throw error;
      }
    },
    [0, [] as ClueConfig[], [] as ConfigError[]],
  );
  const parsedClues = clues as ClueConfig[];
  const parsedErrors = errors as ConfigError[];

  // Errors at this point are high enough priority that we throw so users can resolve them.
  if (parsedErrors.length) {
    throw new BulkError(parsedErrors);
  }

  try {
    // Parse hunt config
    const huntConfig: HuntConfig = ParseHuntOptions(object as HuntConfig);
    ValidateClues(parsedClues);
    huntConfig.clues = parsedClues;

    // Throw bulk error, config errors first
    if (parsedErrors.length) {
      throw new BulkError(parsedErrors);
    }
    return huntConfig;
  } catch (error) {
    // Throw bulk error with clue config errors
    if (error instanceof ConfigError) {
      throw new BulkError([error].concat(parsedErrors));
    }
    throw error;
  }
};

export const DecryptClue = (
  clue: ClueConfig,
  encrypted: boolean,
  secretKey: string,
) => ({
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

export const EncryptClue = (
  clue: ClueConfig,
  encrypted: boolean,
  secretKey: string,
) => ({
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
