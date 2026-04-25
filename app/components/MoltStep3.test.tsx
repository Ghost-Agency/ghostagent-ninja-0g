import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MoltStep3 } from './MoltStep3';

const mockSource = {
  name: 'testagent',
  namespace: 'agent.gno',
  tba: '0x123',
  tier: 'free',
  currentIdentity: 'old-identity',
  originNft: 'none',
  ownerWallet: '0xabc',
  totalXdaiBurned: 0,
  surgeReputationScore: 0,
  ipDomains: [],
  ipPrimary: null
};

const mockTarget = {
  name: 'testagent',
  tld: 'molt.gno',
  fullName: 'testagent.molt.gno',
  isPreset: true
};

describe('MoltStep3', () => {
  it('renders warning about new NFT controlling history', () => {
    render(
      <MoltStep3
        source={mockSource}
        target={mockTarget}
        onBack={() => {}}
        onSuccess={() => {}}
      />
    );
    expect(screen.getByText(/NEW NFT CONTROLS ALL HISTORY/i)).toBeDefined();
  });
});
