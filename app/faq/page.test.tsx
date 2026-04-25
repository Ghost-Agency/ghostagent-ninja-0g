import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FAQPage from './page';

describe('FAQPage', () => {
  it('renders the FAQ header and basic content', () => {
    render(<FAQPage />);
    expect(screen.getByText('How It Works (FAQ)')).toBeDefined();
    expect(screen.getByText('The 3-Step Architecture')).toBeDefined();
    expect(screen.getByText('1. The NFT is the Key')).toBeDefined();
    expect(screen.getByText(/If I sell my NFT, does the new owner get my emails\?/i)).toBeDefined();
  });
});
