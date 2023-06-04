console.log("Using mocked logging library");
// These are the settings used for development logging (both dev and static)

export const logger = {
    debug: (message?: any, ...optionalParams: any[]) => {
        console.debug(message, ...optionalParams);
    },
    info: (message?: any, ...optionalParams: any[]) => {
        console.info(message, ...optionalParams);
    },
    warn: (message?: any, ...optionalParams: any[]) => {
        console.warn(message, ...optionalParams);
    },
    error: (message?: any, ...optionalParams: any[]) => {
        console.error(message, ...optionalParams);
    }
}