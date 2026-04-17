import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  executeTrade, 
  getTokenPriceInXdai, 
  cowOrderToTradeRecord,
  GNOSIS_TOKENS 
} from './cow-dex';
import { WXDAI, USDC_GNOSIS } from './trade-intent';

global.fetch = vi.fn();

describe('Verifiable Finance: CoW Protocol DEX SDK', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const MOCK_SAFE_ADDRESS = '0x1234567890123456789012345678901234567890';
  
  it('should format a MEV-protected presign TradeIntent payload into a CoW orderbook submission', async () => {
    // Mock the Quote API
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        quoteId: 999,
        quote: {
          sellToken: USDC_GNOSIS,
          buyToken: WXDAI,
          sellAmount: '1000000', // 1 USDC
          buyAmount: '1000000000000000000', // 1 WXDAI
          validTo: 1700000000,
          feeAmount: '50000',
        }
      })
    });

    // Mock the Order Submission API
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => '0xmockuid789'
    });

    const res = await executeTrade({
      from: MOCK_SAFE_ADDRESS,
      sellToken: USDC_GNOSIS,
      buyToken: WXDAI,
      sellAmount: '1000000',
      tradeIntentSig: '0x' // Using Presign scheme
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(res.ok).toBe(true);
    expect(res.orderUid).toBe('0xmockuid789');
    
    // Check that it's submitting as presign safely
    const submitArgs = (global.fetch as any).mock.calls[1];
    const submitPayload = JSON.parse(submitArgs[1].body);
    expect(submitPayload.signingScheme).toBe('presign');
    expect(submitPayload.signature).toBe(MOCK_SAFE_ADDRESS);
    expect(submitPayload.sellToken).toBe(USDC_GNOSIS);
  });

  it('should successfully compute a TradeRecord mapping from a filled CoW order', () => {
    const record = cowOrderToTradeRecord({
      agentName: 'treasury.gno',
      orderUid: '0x111',
      sellToken: GNOSIS_TOKENS.USDC,
      buyToken: GNOSIS_TOKENS.WXDAI,
      executedSellAmount: '100000000', // 100 USDC
      executedBuyAmount: '105000000000000000000', // 105 WXDAI
      entryPriceUsd: 1.00, // USDC = $1
      exitPriceUsd: 1.00,  // WXDAI = $1
    });

    // 105 output vs 100 input -> 5 dollars Pnl
    expect(record.pnl).toBe(5);
    expect(record.pnlPct).toBe(0.05);
    expect(record.agentName).toBe('treasury.gno');
    expect(record.market).toBe('USDC/WXDAI');
  });

  it('should successfully mock and handle oracle yield pricing inquiries via CoW Quotes', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        quote: {
          buyAmount: '2000000000000000000', // 2 WXDAI
        }
      })
    });

    // WXDAI defaults to 1.0 natively without fetching
    const wxdaiPrice = await getTokenPriceInXdai(WXDAI, MOCK_SAFE_ADDRESS);
    expect(wxdaiPrice).toBe(1);

    // GNO token pricing mock execution
    const gnoPrice = await getTokenPriceInXdai(GNOSIS_TOKENS.GNO.address, MOCK_SAFE_ADDRESS);
    // sellAmount default is 1e18, quote back was 2e18. 2 / 1 = price of 2.0
    expect(gnoPrice).toBe(2.0);
  });
});
