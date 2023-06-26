import { getProvider } from "src/providers/chrome";

export type OnMessageListenerCallback = (request: any, sender: any, sendResponse: any) => void;

export type OnInstalledListenerCallback = (details: {reason: string}) => void;

export const addMessageListener = (callback: OnMessageListenerCallback) => {
    return getProvider().runtime.onMessage.addListener(callback);
}

export const addInstalledListener = (callback: OnInstalledListenerCallback) => {
    return getProvider().runtime.onInstalled.addListener(callback);
}

export const sendMessage = (message: Object) => {
    return getProvider().runtime.sendMessage(message);
}

export const getURL = (url: string) => {
    return getProvider().runtime.getURL(url);
}

export const getLastError = () => {
    return getProvider().runtime.lastError;
}