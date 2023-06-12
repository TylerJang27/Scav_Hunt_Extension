import { getProvider } from "./chrome";

export const createTab = (url: string) => {
    return getProvider().tabs.create({url});
}
