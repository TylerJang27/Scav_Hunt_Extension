import { getURL } from "src/providers/runtime";
import { saveStorageValues } from "src/providers/storage";
import {
  SaveStorageCallback,
  storageKeys,
  StorageSaveObject,
} from "src/providers/types";

export const resetStorage = (callback: SaveStorageCallback) =>
  saveStorageValues(
    storageKeys.reduce((ret: StorageSaveObject, storageKey) => {
      ret[storageKey] = null;
      return ret;
    }, {}),
    callback,
  );

// TODO: TYLER MAKE SURE THIS WORKS
export const DEFAULT_BACKGROUND = getURL("graphics/background.png");
