import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DashboardAgentCard } from './DashboardAgentCard';

const mockAgent = {
  name: 'testagent',
  namespace: 'agent.gno',
  tba: '0x123',
  tier: 'free',
  ownerWallet: '0xabc'
};

describe('DashboardAgentCard', () => {
  it('renders Wipe Data button and Molt button', () => {
    render(<DashboardAgentCard agent={mockAgent} />);
    const wipeButton = screen.getByText('Wipe Data');
    expect(wipeButton).toBeDefined();
    expect(wipeButton.getAttribute('href')).toBe('https://nftmail.box/dashboard');

    const moltButton = screen.getByText('Molt');
    expect(moltButton).toBeDefined();
  });
});
