// These are the settings used for production logging
// TODO: Make logs namespaced for easier debugging

export const logger = {
  debug: (message?: any, ...optionalParams: any[]) => {
    // no-op
  },
  info: (message?: any, ...optionalParams: any[]) => {
    // no-op
  },
  warn: (message?: any, ...optionalParams: any[]) => {
    console.warn(message, ...optionalParams);
  },
  error: (message?: any, ...optionalParams: any[]) => {
    console.error(message, ...optionalParams);
  },
};
