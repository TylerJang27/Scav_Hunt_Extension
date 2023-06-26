import { getProvider } from "src/providers/chrome";

export type OnClickedListenerCallback = () => void;

export const setBadgeText = (text: string) => {
    return getProvider().action.setBadgeText({text});
}

export const addOnClickedListener = (callback: OnClickedListenerCallback) => {
    return getProvider().action.onClicked.addListener(callback);
}