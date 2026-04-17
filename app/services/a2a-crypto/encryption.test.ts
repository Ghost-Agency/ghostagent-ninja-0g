import { describe, it, expect } from 'vitest';
import crypto from 'node:crypto';
import { sealSymmetricPayload, unsealSymmetricPayload } from './encryption';

describe('A2A Crypto ECIES Encapsulation', () => {
  // Generate a valid 32-byte (64-char hex) key
  const validKey = crypto.randomBytes(32).toString('hex');
  const invalidKey = 'deadbeef'; // clearly wrong length

  it('should encrypt and decrypt a valid payload seamlessly', () => {
    const rawMessage = JSON.stringify({
      intent: 'EXECUTE_SWAP',
      amount: '500.00'
    });

    // Seal
    const sealed = sealSymmetricPayload(validKey, rawMessage);
    
    expect(sealed).toHaveProperty('iv');
    expect(sealed).toHaveProperty('authTag');
    expect(sealed).toHaveProperty('cipherText');
    expect(sealed.cipherText).not.toBe(rawMessage);

    // Unseal
    const unsealed = unsealSymmetricPayload(validKey, sealed);
    expect(unsealed).toBe(rawMessage);
  });

  it('should fail to unseal if given the wrong key', () => {
    const rawMessage = 'Top secret Agent Memory data';
    const sealed = sealSymmetricPayload(validKey, rawMessage);
    
    const wrongKey = crypto.randomBytes(32).toString('hex');

    // Trying to decrypt with wrong key fails AES-GCM auth
    expect(() => {
      unsealSymmetricPayload(wrongKey, sealed);
    }).toThrow();
  });

  it('should strictly throw if key length is invalid upon seal', () => {
    expect(() => sealSymmetricPayload(invalidKey, 'hello')).toThrow('Secret key must be a 64-character hex string');
  });

  it('should strictly throw if key length is invalid upon unseal', () => {
    const mockSealed = { iv: 'a', authTag: 'b', cipherText: 'c' };
    expect(() => unsealSymmetricPayload(invalidKey, mockSealed)).toThrow('Secret key must be a 64-character hex string');
  });
});
