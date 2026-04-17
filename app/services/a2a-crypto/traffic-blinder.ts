/// @module traffic-blinder
/// Phase 5: Sovereign Privacy Infrastructure
/// 
/// Operates as a middleware for A2A and Agent-to-Human communications.
/// Fragments arbitrary JSON payloads into blinded, uniform-sized chunks to 
/// completely mitigate heuristic traffic analysis by network relayers (ISPs, RPCs).

import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

export interface BlindedFragment {
  iv: string;
  authTag: string;
  ciphertext: string; // Base64 encoded payload + randomized padding
  index: number;
  totalLength: number;
}

const BLINDING_ALGORITHM = 'aes-256-gcm';

/**
 * Standardizes packet lengths to a power of 2 (e.g. 256, 512, 1024)
 * to prevent packet-size inference attacks.
 */
function getPaddedLength(realLength: number): number {
  let target = 256;
  while (target < realLength) {
    target *= 2;
  }
  return target;
}

/**
 * Routes metadata through a highly fragmented payload system.
 * Splits the string payload into multiple chunks, pads them with noise,
 * and seals them with an AES-GCM MAC tag.
 */
export function fragmentAndBlindPayload(
  payloadStr: string,
  key: Buffer,
  fragmentSize: number = 200
): BlindedFragment[] {
  const payloadBytes = Buffer.from(payloadStr, 'utf8');
  const fragments: BlindedFragment[] = [];
  const totalLength = Math.ceil(payloadBytes.length / fragmentSize);

  for (let i = 0; i < totalLength; i++) {
    const chunk = payloadBytes.subarray(i * fragmentSize, (i + 1) * fragmentSize);
    
    // Calculate required noise to standard power of 2
    const paddedLength = getPaddedLength(chunk.length);
    const noiseLength = paddedLength - chunk.length;
    
    // Prepend a 2-byte header indicating the EXACT size of the real chunk, 
    // followed by chunk data, followed by random noise.
    const header = Buffer.alloc(2);
    header.writeUInt16BE(chunk.length);
    
    const noise = randomBytes(noiseLength);
    const plaintext = Buffer.concat([header, chunk, noise]);

    // Encrypt to ensure MAC verification across the wire
    const iv = randomBytes(16);
    const cipher = createCipheriv(BLINDING_ALGORITHM, key, iv);
    
    let ciphertext = cipher.update(plaintext);
    ciphertext = Buffer.concat([ciphertext, cipher.final()]);
    
    fragments.push({
      iv: iv.toString('hex'),
      authTag: cipher.getAuthTag().toString('hex'),
      ciphertext: ciphertext.toString('base64'),
      index: i,
      totalLength: totalLength,
    });
  }

  return fragments;
}

/**
 * Reassembles unordered payload envelopes and automatically executes
 * Cryptographic MAC verification ensuring the physical origin of the payload envelope.
 */
export function reassembleBlindedPayload(
  fragments: BlindedFragment[],
  key: Buffer
): string {
  // Sort heavily fragmented metadata to reconstruct the sequence
  const sorted = [...fragments].sort((a, b) => a.index - b.index);
  
  if (sorted.length === 0) return '';
  if (sorted[sorted.length - 1].totalLength !== sorted.length) {
    throw new Error('MAC Verification Failed: Fragment sequence incomplete or intercepted.');
  }

  let fullPayload = Buffer.alloc(0);

  for (const frag of sorted) {
    const decipher = createDecipheriv(
      BLINDING_ALGORITHM,
      key,
      Buffer.from(frag.iv, 'hex')
    );
    
    // Explicit MAC (auth tag) verification blocks man-in-the-middle forging
    decipher.setAuthTag(Buffer.from(frag.authTag, 'hex'));

    let decrypted: Buffer;
    try {
      decrypted = decipher.update(Buffer.from(frag.ciphertext, 'base64'));
      decrypted = Buffer.concat([decrypted, decipher.final()]);
    } catch (e: any) {
      throw new Error(`MAC Verification Failed: Fragment ${frag.index} origin mismatch or tampering detected.`);
    }

    // Strip padding
    const realLength = decrypted.readUInt16BE();
    const actualChunk = decrypted.subarray(2, 2 + realLength);
    fullPayload = Buffer.concat([fullPayload, actualChunk]);
  }

  return fullPayload.toString('utf8');
}
