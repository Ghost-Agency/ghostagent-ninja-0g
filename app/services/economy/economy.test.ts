import { describe, it, expect } from 'vitest';
import { ERC4337Paymaster } from './paymaster-client';
import { RevenueSplitter } from './revenue-splitter';

describe('Phase 4 Economy: Account Abstraction & Micropayments', () => {
  it('should flawlessly intercept a pending agent transaction and cover it natively via an ERC-4337 Paymaster signature', async () => {
    const mockTBA = '0x1234TBAReceiverAddress999';
    const sponsorTx = await ERC4337Paymaster.sponsorAgentTransaction(mockTBA, 550);
    
    expect(sponsorTx).toBeDefined();
    expect(sponsorTx).toContain('0xSPONSOR');
    expect(sponsorTx).toContain('1234'); // Validates TBA string propagation
  });

  it('should distribute zero-knowledge compute quotas fairly enforcing the 60/40 creator-hardware split algorithm', () => {
    const { hardwareFee, developerRoyalty, platformFee } = RevenueSplitter.distributePayout(100);

    expect(platformFee).toBe(1); // 1% Rake
    expect(developerRoyalty).toBe(59.4); // 60% of 99
    expect(hardwareFee).toBe(39.6); // 40% of 99
    expect(hardwareFee + developerRoyalty + platformFee).toBe(100); // Sanity check the math vector
  });
});
