import { getProvider } from "./chrome";
import { StorageKeys, LoadStorageCallback, StorageSaveObject, SaveStorageCallback } from "./types";

export const loadStorageValue = (key: StorageKeys, callback: LoadStorageCallback) => {
    return getProvider().storage.local.get(key, callback);
}

export const loadStorageValues = (keys: StorageKeys[], callback: LoadStorageCallback) => {
    return getProvider().storage.local.get(keys, callback);
}

export const saveStorageValues = (values: StorageSaveObject, callback: SaveStorageCallback) => {
    return getProvider().storage.local.set(values, callback);
}