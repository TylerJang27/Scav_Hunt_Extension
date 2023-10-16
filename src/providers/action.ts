import { getProvider } from "src/providers/chrome";

export type OnClickedListenerCallback = () => void;
export type GetBadgeTextCallback = (result: string) => void;

export const setBadgeText = (text: string) =>
  getProvider().action.setBadgeText({ text });

export const getBadgeText = (callback: GetBadgeTextCallback) =>
  getProvider().action.getBadgeText({}, callback);

export const addOnClickedListener = (callback: OnClickedListenerCallback) =>
  getProvider().action.onClicked.addListener(callback);
