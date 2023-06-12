// These are the settings used for test mocks to avoid noisy test logs.

export const logger = {
    debug: (message?: any, ...optionalParams: any[]) => {
        // no-op
        // console.debug(message, ...optionalParams);
    },
    info: (message?: any, ...optionalParams: any[]) => {
        // no-op
        // console.log(message, ...optionalParams);
    },
    warn: (message?: any, ...optionalParams: any[]) => {
        // console.warn(message, ...optionalParams);
    },
    error: (message?: any, ...optionalParams: any[]) => {
        console.error(message, ...optionalParams);
    }
}
