export const EMPTY_OR_INVALID_HUNT = "Error. Empty or invalid hunt.";
export const UNKNOWN_ERROR_RESET_HUNT = "Unknown error. Please reset the hunt.";

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ConfigError.prototype);
  }
}

export const SUPPORTED_VERSIONS = ["1.0"];

export class UnsupportedVersionError extends ConfigError {
  constructor(version: string) {
    super(
      `Supplied version ${version}. Version must be one of [${SUPPORTED_VERSIONS.join(
        ", ",
      )}]`,
    );

    Object.setPrototypeOf(this, UnsupportedVersionError.prototype);
  }
}

export class InvalidIndexError extends ConfigError {
  constructor(index: number, expected: number) {
    super(`Parsed invalid index ${index}. Expected ${expected}`);

    Object.setPrototypeOf(this, InvalidIndexError.prototype);
  }
}

export class MissingFieldError extends ConfigError {
  index?: number;

  constructor(fieldName: string, index?: number) {
    if (index !== undefined) {
      super(`Missing field '${fieldName}' in clue index ${index + 1}`);
    } else {
      super(`Missing field '${fieldName}'`);
    }
    this.index = index;

    Object.setPrototypeOf(this, MissingFieldError.prototype);
  }
}

export class XORFieldsError extends ConfigError {
  index?: number;

  constructor(
    value1: any,
    fieldName1: string,
    value2: any,
    fieldName2: string,
    index?: number,
  ) {
    if (index) {
      super(
        `Exactly one of ${fieldName1} and ${fieldName2} can be set in clue index ${index}. Got ${value1} and ${value2}`,
      );
    } else {
      super(
        `Exactly one of ${fieldName1} and ${fieldName2} can be set. Got ${value1} and ${value2}`,
      );
    }
    this.index = index;

    Object.setPrototypeOf(this, XORFieldsError.prototype);
  }
}

export class DeprecatedFieldError extends ConfigError {
  index?: number;

  constructor(fieldName: string, index?: number) {
    if (index !== undefined) {
      super(`Deprecated field '${fieldName}' in clue index ${index + 1}`);
    } else {
      super(`Deprecated field '${fieldName}'`);
    }
    this.index = index;

    Object.setPrototypeOf(this, DeprecatedFieldError.prototype);
  }
}

export class MissingValueError extends ConfigError {
  index?: number;

  constructor(fieldName: string, index?: number) {
    if (index) {
      super(`Received empty field for ${fieldName} in clue index ${index}`);
    } else {
      super(`Received empty field for ${fieldName}`);
    }
    this.index = index;

    Object.setPrototypeOf(this, MissingValueError.prototype);
  }
}

export class TooFewObjectsError extends ConfigError {
  constructor(
    fieldName: string,
    minimumSize: number = 1,
    provided: number = 0,
  ) {
    super(
      `Field ${fieldName} requires at least ${minimumSize} objects. Received ${provided}`,
    );

    Object.setPrototypeOf(this, TooFewObjectsError.prototype);
  }
}

/**
 * https://developer.chrome.com/docs/extensions/reference/api/storage#storage_areas
 * Maximum size is 10 MB. We also store (storageKeys):
 * - currentProgress: int
 * - huntConfig: full
 * - maxProgress: int
 * - sourceInfo: string (user)
 * - sourceType: string (enum)
 * - userConfig: Object (1 key)
 * So we set 8 MB to be safe.
 */
export const MAXIMUM_SIZE = 8 * 1024 * 1024;

export class FileTooLargeError extends ConfigError {
  constructor(size: number) {
    super(
      `Provided config of size ${size} exceeds maximum size ${MAXIMUM_SIZE}`,
    );

    Object.setPrototypeOf(this, FileTooLargeError.prototype);
  }
}

export const throwIfTooLarge = (json: any) => {
  const jsonString = JSON.stringify(json);
  const blob = new Blob([jsonString], { type: "text/plain" });
  if (blob.size > MAXIMUM_SIZE) {
    throw new FileTooLargeError(blob.size);
  }
};

export class BulkError extends Error {
  errors: ConfigError[];

  constructor(errors: ConfigError[]) {
    super(errors.map((e) => e.message).join("\n"));
    this.errors = errors;

    Object.setPrototypeOf(this, BulkError.prototype);
  }
}
