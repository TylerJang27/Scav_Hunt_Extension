import { getProvider } from "src/providers/chrome";

export const createTab = (url: string) => getProvider().tabs.create({ url });
