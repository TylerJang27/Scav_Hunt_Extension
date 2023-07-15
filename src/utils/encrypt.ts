import { encrypt, decrypt } from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

export const Encrypt = (
  text: string,
  encrypted: boolean,
  secretKey: string
) => {
  if (encrypted) {
    return encrypt(text, secretKey).toString();
  }
  return text;
};

export const Decrypt = (
  text: string,
  encrypted: boolean,
  secretKey: string
) => {
  if (encrypted) {
    const bytes = decrypt(text, secretKey);
    return bytes.toString(Utf8);
  }
  return text;
};

export const wrapDecrypt = (
  text: string | undefined,
  encoded: boolean,
  secretKey: string
) => {
  if (text) {
    return Decrypt(text, encoded, secretKey);
  }
  return undefined;
};

export const wrapEncrypt = (
  text: string | undefined,
  encoded: boolean,
  secretKey: string
) => {
  if (text) {
    return Encrypt(text, encoded, secretKey);
  }
  return undefined;
};
