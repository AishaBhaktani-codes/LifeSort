import crypto from 'crypto';

class TEEService {
  deriveUserKey(userId, masterSecret) {
    // HKDF key derivation
    return crypto.hkdfSync(
      'sha256',
      masterSecret,
      Buffer.from(userId),
      Buffer.from('lifesort-tee-user-key-salt'),
      32
    );
  }

  encrypt(plaintext, userKey) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', userKey, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag().toString('hex');
    
    // Format: iv:tag:encrypted
    return `${iv.toString('hex')}:${tag}:${encrypted}`;
  }

  decrypt(ciphertext, userKey) {
    const parts = ciphertext.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid ciphertext format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', userKey, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
  
  async secureProcess(userId, rawTranscript, processFn) {
    const masterSecret = process.env.MASTER_SECRET || 'fallback-master-secret-change-me';
    const key = this.deriveUserKey(userId, masterSecret);
    const decrypted = this.decrypt(rawTranscript, key);
    const result = await processFn(decrypted);  // LLM processing
    return this.encrypt(JSON.stringify(result), key);
  }
}

export default new TEEService();
