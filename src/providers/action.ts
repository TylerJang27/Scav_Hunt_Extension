import { getProvider } from "src/providers/chrome";

export type OnClickedListenerCallback = () => void;

export const setBadgeText = (text: string) =>
  getProvider().action.setBadgeText({ text });

export const addOnClickedListener = (callback: OnClickedListenerCallback) =>
  getProvider().action.onClicked.addListener(callback);
