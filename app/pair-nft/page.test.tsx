import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OgNftMoltPage from './page';

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: () => null })
}));

vi.mock('@privy-io/react-auth', () => ({
  usePrivy: () => ({ authenticated: true }),
  useWallets: () => ({ wallets: [{ address: '0xmock' }] })
}));

// Mock MercuryoButton to prevent any weird fetch or component issues
vi.mock('../components/MercuryoWidget', () => ({
  MercuryoButton: () => <button>Mercuryo</button>
}));

describe('BYOMolt Page', () => {
  it('renders correctly', () => {
    render(<OgNftMoltPage />);
    expect(screen.getByText(/BYO NFT Molt/i)).toBeDefined();
  });
});
