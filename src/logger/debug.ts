console.log("Using mocked logging library");
// These are the settings used for development logging (both dev and static)

export const logger = {
  debug: (message?: any, ...optionalParams: any[]) => {
    // trunk-ignore(eslint/@typescript-eslint/no-unsafe-argument)
    console.debug(message, ...optionalParams);
  },
  info: (message?: any, ...optionalParams: any[]) => {
    // trunk-ignore(eslint/@typescript-eslint/no-unsafe-argument)
    console.info(message, ...optionalParams);
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
