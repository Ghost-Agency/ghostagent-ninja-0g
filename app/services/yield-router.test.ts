import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sweepToYieldVault, retrieveFromYieldVault, SDAI_GNOSIS } from './yield-router';
import { WXDAI } from './trade-intent';

global.fetch = vi.fn();

describe('Agentic Autonomous Yield Execution', () => {
  const MOCK_SAFE = '0x5555555555555555555555555555555555555555';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should autonomously command the CoW Dex to route WXDAI into the highest yield stable pool (sDAI)', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ quoteId: 44, quote: { sellAmount: '1000', buyAmount: '950', feeAmount: '0' } })
    });

    const result = await sweepToYieldVault(MOCK_SAFE, '1000000000000000000'); // 1 WXDAI
    
    expect(result?.estimatedApy).toBe(5.0);
    expect(result?.trade.ok).toBe(true);
    
    // Verify it requested a quote for WXDAI -> sDAI
    const quoteCallBody = JSON.parse((global.fetch as any).mock.calls[0][1].body);
    expect(quoteCallBody.sellToken).toBe(WXDAI);
    expect(quoteCallBody.buyToken).toBe(SDAI_GNOSIS);
  });

  it('should accurately command withdrawal off the yield peg back into WXDAI', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ quoteId: 10, quote: { sellAmount: '100', buyAmount: '100', feeAmount: '0' } })
    });

    const trade = await retrieveFromYieldVault(MOCK_SAFE, '500');
    expect(trade?.ok).toBe(true);

    const quoteCallBody = JSON.parse((global.fetch as any).mock.calls[0][1].body);
    expect(quoteCallBody.sellToken).toBe(SDAI_GNOSIS);
    expect(quoteCallBody.buyToken).toBe(WXDAI);
  });
});
