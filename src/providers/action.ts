import { getProvider } from "./chrome";

export type OnClickedListenerCallback = () => void;

export const setBadgeText = (text: string) => {
    return getProvider().action.setBadgeText({text});
}

export const addOnClickedListener = (callback: OnClickedListenerCallback) => {
    return getProvider().action.onClicked.addListener(callback);
}