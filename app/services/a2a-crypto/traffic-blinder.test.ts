import { describe, it, expect } from 'vitest';
import { randomBytes } from 'crypto';
import { fragmentAndBlindPayload, reassembleBlindedPayload } from './traffic-blinder';

describe('Sovereign Privacy: Traffic Blinder & Fragmentation Suite', () => {
  const SYMMETRIC_KEY = randomBytes(32); // 256-bit key

  it('should perfectly fragment, pad, and MAC-seal a large JSON payload, then reassemble it', () => {
    // Generate an artificially inflated deep context memory JSON string
    const largeAgentPayload = JSON.stringify({
      agentState: 'ACTIVE',
      memoryVector: Array(500).fill('crypto_context_state_data_point_test').join('-'),
      directives: ['Execute x402 reverse-billing', 'Shield TEE variables']
    });

    const fragments = fragmentAndBlindPayload(largeAgentPayload, SYMMETRIC_KEY, 150);
    
    // Base 64 string testing to ensure no raw text is transmitted
    expect(fragments.length).toBeGreaterThan(5);
    expect(fragments[0].ciphertext.includes('ACTIVE')).toBe(false);

    // Reconstruct
    const reassembled = reassembleBlindedPayload(fragments, SYMMETRIC_KEY);
    expect(reassembled).toBe(largeAgentPayload);
  });

  it('should successfully enforce MAC verification by intentionally rejecting forged fragments', () => {
    const secretMessage = 'The Sovereign 0G relay is active.';
    const fragments = fragmentAndBlindPayload(secretMessage, SYMMETRIC_KEY, 50);

    // Tamper with the ciphertext maliciously to simulate MITM interception
    const maliciousFragments = [...fragments];
    maliciousFragments[0].ciphertext = maliciousFragments[0].ciphertext.replace('A', 'B');

    expect(() => {
      reassembleBlindedPayload(maliciousFragments, SYMMETRIC_KEY);
    }).toThrowError('MAC Verification Failed: Fragment 0 origin mismatch or tampering detected.');
  });

  it('should properly guard against dropped packets preventing reconstruction loops', () => {
    const payload = 'Route all protocol metadata through highly fragmented payload systems';
    const fragments = fragmentAndBlindPayload(payload, SYMMETRIC_KEY, 10); // Super small fragments
    
    // Remove one fragment entirely
    fragments.pop();

    expect(() => {
      reassembleBlindedPayload(fragments, SYMMETRIC_KEY);
    }).toThrowError('MAC Verification Failed: Fragment sequence incomplete or intercepted.');
  });
});
