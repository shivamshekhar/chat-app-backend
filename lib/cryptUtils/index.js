const crypto = require("crypto");

const ENCRYPTION_ALGO = "aes-256-cbc";
const ENCRYPTION_PASSWORD = "helloworld";
const CRYPTION_ENCODING = 'hex';
const DELIMITER = '-';
const HASH_ALGO = 'sha256';
const HASH_ENCODING = 'hex';
const SALT = "salt";
const KEY_SIZE = 32;
const ITERATIONS = 1000;

class CryptUtils {
  static convertPasswordToHash(password) {
    if (typeof password === "string" && password.length > 0) {
      const hash = crypto.createHash(HASH_ALGO);
      hash.update(password);
      return hash.digest(HASH_ENCODING);
    } else {
      throw new TypeError("Provided value is not a valid string");
    }
  }

  static encryptString(str) {
    if (typeof str === "string" && str.length > 0) {
      const key = crypto.pbkdf2Sync(ENCRYPTION_PASSWORD, SALT, ITERATIONS, KEY_SIZE, HASH_ALGO);
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(ENCRYPTION_ALGO, key, iv);
      const encrypted =
        cipher.update(str, "utf8", CRYPTION_ENCODING) + cipher.final(CRYPTION_ENCODING);
      return `${iv.toString(CRYPTION_ENCODING)}${DELIMITER}${encrypted}`;
    } else {
      throw new TypeError("Provided value is not a valid string");
    }
  }

  static decryptString(encryptedStr) {
    if (typeof encryptedStr === "string" && encryptedStr.length > 0) {
      encryptedStr = encryptedStr.split(DELIMITER);
      const iv = Buffer.from(encryptedStr[0], CRYPTION_ENCODING);
      const encrypted = encryptedStr[1];
      const key = crypto.pbkdf2Sync(ENCRYPTION_PASSWORD, SALT, ITERATIONS, KEY_SIZE, HASH_ALGO);
      const decipher = crypto.createDecipheriv(ENCRYPTION_ALGO, key, iv);
      return (
        decipher.update(encrypted, CRYPTION_ENCODING, "utf8") + decipher.final("utf8")
      );
    } else {
      throw new TypeError("Provided value is not a valid string");
    }
  }
}

module.exports = CryptUtils;
