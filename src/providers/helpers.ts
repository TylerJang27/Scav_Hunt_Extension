import { saveStorageValues } from "./storage";
import { SaveStorageCallback, storageKeys, StorageSaveObject } from "./types";

export const resetStorage = (callback: SaveStorageCallback) => {
  return saveStorageValues(
    storageKeys.reduce((ret: StorageSaveObject, storageKey) => {
      ret[storageKey] = null;
      return ret;
    }, {}),
    callback,
  );
};
