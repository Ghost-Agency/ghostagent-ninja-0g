import crypto from 'node:crypto';

export interface SealedA2APayload {
  iv: string;
  authTag: string;
  cipherText: string;
}

/**
 * Seals an A2A message intended for a Smart Account or internal Agent memory.
 * Note: In a pure ECIES pattern, this uses the public key. Here we mock symmetric 
 * encapsulation for isolated unit testing prior to Web3 e2e integration.
 */
export function sealSymmetricPayload(secretKey: string, message: string): SealedA2APayload {
  if (!secretKey || secretKey.length !== 64) {
    throw new Error('Secret key must be a 64-character hex string (32 bytes).');
  }

  const key = Buffer.from(secretKey, 'hex');
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv('aes-256-gcm', key as any, iv as any);
  
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  return {
    iv: iv.toString('hex'),
    authTag,
    cipherText: encrypted
  };
}

/**
 * Unseals a symmetric A2A pipeline message.
 */
export function unsealSymmetricPayload(secretKey: string, payload: SealedA2APayload): string {
  if (!secretKey || secretKey.length !== 64) {
    throw new Error('Secret key must be a 64-character hex string (32 bytes).');
  }

  const key = Buffer.from(secretKey, 'hex');
  const iv = Buffer.from(payload.iv, 'hex');
  const authTag = Buffer.from(payload.authTag, 'hex');
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', key as any, iv as any);
  decipher.setAuthTag(authTag as any);
  
  let decrypted = decipher.update(payload.cipherText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
