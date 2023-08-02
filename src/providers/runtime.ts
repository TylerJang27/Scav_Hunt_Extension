import { getProvider } from "src/providers/chrome";

export type OnMessageListenerCallback = (
  request: any,
  sender: any,
  sendResponse: any,
) => void;

export type OnInstalledListenerCallback = (details: { reason: string }) => void;

export const addMessageListener = (callback: OnMessageListenerCallback) =>
  getProvider().runtime.onMessage.addListener(callback);

export const addInstalledListener = (callback: OnInstalledListenerCallback) =>
  getProvider().runtime.onInstalled.addListener(callback);

export const sendMessage = (message: unknown) =>
  getProvider().runtime.sendMessage(message);

export const getURL = (url: string) => getProvider().runtime.getURL(url);

export const getLastError = () => getProvider().runtime.lastError;
