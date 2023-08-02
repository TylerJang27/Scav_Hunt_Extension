// These are the settings used for production logging
// TODO: Make logs namespaced for easier debugging

export const logger = {
  // trunk-ignore(eslint/@typescript-eslint/no-unused-vars)
  debug: (message?: any, ...optionalParams: any[]) => {
    // no-op
  },
  // trunk-ignore(eslint/@typescript-eslint/no-unused-vars)
  info: (message?: any, ...optionalParams: any[]) => {
    // no-op
  },
  warn: (message?: any, ...optionalParams: any[]) => {
    // trunk-ignore(eslint/@typescript-eslint/no-unsafe-argument)
    console.warn(message, ...optionalParams);
  },
  error: (message?: any, ...optionalParams: any[]) => {
    // trunk-ignore(eslint/@typescript-eslint/no-unsafe-argument)
    console.error(message, ...optionalParams);
  },
};
