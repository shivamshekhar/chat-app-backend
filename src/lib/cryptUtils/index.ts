import crypto from "crypto";

const ENCRYPTION_ALGO = "aes-256-cbc";
const ENCRYPTION_PASSWORD = "helloworld";
const CRYPTION_ENCODING = 'hex';
const DELIMITER = '-';
const HASH_ALGO = 'sha256';
const HASH_ENCODING = 'hex';
const SALT = "salt";
const KEY_SIZE = 32;
const ITERATIONS = 1000;

export class CryptUtils {
  static convertPasswordToHash(password: string): string {
    if (password.length) {
      const hash = crypto.createHash(HASH_ALGO);
      hash.update(password);
      return hash.digest(HASH_ENCODING);
    } else {
      throw new TypeError("Provided value is an empty string");
    }
  }

  static encryptString(str: string): string {
    if (str.length) {
      const key = crypto.pbkdf2Sync(ENCRYPTION_PASSWORD, SALT, ITERATIONS, KEY_SIZE, HASH_ALGO);
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(ENCRYPTION_ALGO, key, iv);
      const encrypted =
        cipher.update(str, "utf8", CRYPTION_ENCODING) + cipher.final(CRYPTION_ENCODING);
      return `${iv.toString(CRYPTION_ENCODING)}${DELIMITER}${encrypted}`;
    } else {
      throw new TypeError("Provided value is an empty string");
    }
  }

  static decryptString(encryptedStr: string): string {
    if (encryptedStr.length) {
      const encryptedStrArr:string[] = encryptedStr.split(DELIMITER);
      const iv = Buffer.from(encryptedStrArr[0], CRYPTION_ENCODING);
      const encrypted = encryptedStrArr[1];
      const key = crypto.pbkdf2Sync(ENCRYPTION_PASSWORD, SALT, ITERATIONS, KEY_SIZE, HASH_ALGO);
      const decipher = crypto.createDecipheriv(ENCRYPTION_ALGO, key, iv);
      return (
        decipher.update(encrypted, CRYPTION_ENCODING, "utf8") + decipher.final("utf8")
      );
    } else {
      throw new TypeError("Provided value is an empty string");
    }
  }
}
