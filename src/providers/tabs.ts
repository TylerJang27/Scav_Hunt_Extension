import { getProvider } from "src/providers/chrome";

export const createTab = (url: string) => {
  return getProvider().tabs.create({ url });
};
