import { getProvider } from "src/providers/chrome";
import {
  LoadStorageCallback,
  SaveStorageCallback,
  StorageKeys,
  StorageSaveObject,
} from "src/providers/types";

export const loadStorageValue = (
  key: StorageKeys,
  callback: LoadStorageCallback,
) => getProvider().storage.local.get(key, callback);

export const loadStorageValues = (
  keys: StorageKeys[],
  callback: LoadStorageCallback,
) => getProvider().storage.local.get(keys, callback);

export const saveStorageValues = (
  values: StorageSaveObject,
  callback: SaveStorageCallback,
) => getProvider().storage.local.set(values, callback);
