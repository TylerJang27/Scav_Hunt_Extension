export type LoadStorageCallback = (items: any) => void;

export type SaveStorageCallback = () => void;

// All storage values must be named here in order to ensure consistency across the extension.
export const storageKeys = [
  "maxProgress",
  "currentProgress",
  "sourceType",
  "huntConfig",
] as const;
export type StorageKeys = (typeof storageKeys)[number];

export type StorageSaveObject = {
  [key in StorageKeys]?: any;
};
