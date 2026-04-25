import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MarketplaceTransferAgreement } from './MarketplaceTransferAgreement';

vi.mock('@privy-io/react-auth', () => ({
  useWallets: () => ({ wallets: [{ address: '0xmock' }] })
}));

describe('MarketplaceTransferAgreement', () => {
  it('renders critical warning about transferring the inbox', () => {
    render(
      <MarketplaceTransferAgreement
        agentName="testagent"
        safeAddress="0xsafe"
        listingPriceXdai={10}
        namespace="agent.gno"
        onSigned={() => {}}
        onCancel={() => {}}
      />
    );
    expect(screen.getByText(/CRITICAL WARNING: YOU ARE SELLING YOUR INBOX/i)).toBeDefined();
    expect(screen.getByText(/Sovereign Burn/i)).toBeDefined();
  });
});
