import { Decrypt, Encrypt } from "../../src/utils/parse";

const inputStrings = [
  "1",
  "",
  "This is my string",
  "These are my strings",
  "This is a really long paragraph don't you think? Definitely long enough to be good test data.",
];

it("Encrypt and decrypt", () => {
  inputStrings.forEach((input) => {
    const encrypted = Encrypt(input, true);
    if (input === "") {
      expect(encrypted).toEqual(input);
    } else {
      expect(encrypted).not.toEqual(input);
    }
    const decrypted = Decrypt(encrypted, true);
    expect(decrypted).toEqual(input);
  });
});

it("Encrypt and decrypt no encryption", () => {
  inputStrings.forEach((input) => {
    const encrypted = Encrypt(input, false);
    expect(encrypted).toEqual(input);
    const decrypted = Decrypt(encrypted, false);
    expect(decrypted).toEqual(input);
  });
});
