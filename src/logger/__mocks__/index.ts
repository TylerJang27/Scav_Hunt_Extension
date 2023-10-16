// These are the settings used for test mocks to avoid noisy test logs.

export const logger = {
  // trunk-ignore(eslint/@typescript-eslint/no-unused-vars)
  debug: (message?: any, ...optionalParams: any[]) => {
    // no-op
    // console.debug(message, ...optionalParams);
  },
  // trunk-ignore(eslint/@typescript-eslint/no-unused-vars)
  info: (message?: any, ...optionalParams: any[]) => {
    // no-op
    // console.log(message, ...optionalParams);
  },
  // trunk-ignore(eslint/@typescript-eslint/no-unused-vars)
  warn: (message?: any, ...optionalParams: any[]) => {
    // console.warn(message, ...optionalParams);
  },
  error: (message?: any, ...optionalParams: any[]) => {
    // trunk-ignore(eslint/@typescript-eslint/no-unsafe-argument)
    console.error(message, ...optionalParams);
  },
};
