export class ConfigError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ConfigError.prototype);
  }
}

export const SUPPORTED_VERSIONS = ["1.0"];

export class UnsupportedVersionError extends ConfigError {
  constructor(version: string) {
    super(`Supplied version ${version}. Version must be one of [${SUPPORTED_VERSIONS.join(", ")}]`);

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
    if (index) {
      super(`Missing field ${fieldName} in clue index ${index}`);
    } else {
      super(`Missing field ${fieldName}`);
    }
    this.index = index;

    Object.setPrototypeOf(this, MissingFieldError.prototype);
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
  constructor(fieldName: string, minimumSize: number = 1, provided: number = 0) {
    super(`Field ${fieldName} requires at least ${minimumSize} objects. Received ${provided}`);

    Object.setPrototypeOf(this, TooFewObjectsError.prototype);
  }
}

// TODO: TYLER FIX MAXIMUM SIZE
export const MAXIMUM_SIZE = 200;

export class FileTooLargeError extends ConfigError {
  constructor(size: number) {
    super(`Provided config of size ${size} exceeds maximum size ${MAXIMUM_SIZE}`);

    Object.setPrototypeOf(this, FileTooLargeError.prototype);
  }
}

export class BulkError extends Error {
  errors: ConfigError[];

  constructor(errors: ConfigError[]) {
    super(errors.join("\n"));
    this.errors = errors;

    Object.setPrototypeOf(this, BulkError.prototype);
  }
}
