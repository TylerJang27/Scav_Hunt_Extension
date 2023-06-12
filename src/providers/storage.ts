import { getProvider } from "./chrome";

export type LoadStorageCallback = (items: any) => void;

export type SaveStorageCallback = () => void;

export const loadStorageValue = (key: string, callback: LoadStorageCallback) => {
    return getProvider().storage.local.get(key, callback);
}

export const loadStorageValues = (keys: string[], callback: LoadStorageCallback) => {
    return getProvider().storage.local.get(keys, callback);
}

export const saveStorageValues = (values: Object, callback: SaveStorageCallback) => {
    return getProvider().storage.local.set(values, callback);
}