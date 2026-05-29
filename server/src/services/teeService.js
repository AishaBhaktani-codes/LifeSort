import crypto from 'crypto';
import { config } from '../config/index.js';

export class TEEService {
  static ALGORITHM = 'aes-256-gcm';
  static IV_LENGTH = 16;
  static SALT_LENGTH = 16;
  static AUTH_TAG_LENGTH = 16;

  /**
   * Derive a user-specific encryption key securely using HKDF
   */
  static deriveUserKey(userId, userSalt) {
    if (!config.tee.masterSecret) {
      throw new Error('TEE Master Secret is not configured');
    }

    // Use HKDF to derive a 32-byte key
    // Info string provides context for the derived key
    const info = 'LifeSort_User_Data_Encryption';
    
    // In a real TEE, this derivation happens inside the enclave
    return crypto.hkdfSync(
      'sha256',
      config.tee.masterSecret, // Master Key Material
      userSalt,                // User specific salt
      info,                    // Context info
      32                       // Length for AES-256
    );
  }

  /**
   * Encrypt plaintext into a hex string containing salt, iv, auth tag, and ciphertext
   */
  static encrypt(plaintext, userKey) {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(this.ALGORITHM, userKey, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    
    // Format: iv:authTag:ciphertext
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  /**
   * Decrypt ciphertext back to plaintext
   */
  static decrypt(encryptedData, userKey) {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const [ivHex, authTagHex, encryptedTextHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(this.ALGORITHM, userKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedTextHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Securely execute a processing function (e.g., LLM call) over decrypted data
   * Ensures data is decrypted only in memory for the duration of the function
   */
  static async secureProcess(userId, userSalt, encryptedData, processFn) {
    const key = this.deriveUserKey(userId, userSalt);
    let decryptedData;
    
    try {
      decryptedData = this.decrypt(encryptedData, key);
      
      // Execute the processing function with decrypted data
      const result = await processFn(decryptedData);
      
      // If the result needs to be stored, re-encrypt it
      if (typeof result === 'object' || typeof result === 'string') {
        const resultString = typeof result === 'object' ? JSON.stringify(result) : result;
        return {
          raw: result,
          encrypted: this.encrypt(resultString, key)
        };
      }
      
      return { raw: result, encrypted: null };
    } finally {
      // Best effort to clear decrypted data from memory
      // In Node.js, we can't manually free memory, but we can dereference
      decryptedData = null;
    }
  }
}
