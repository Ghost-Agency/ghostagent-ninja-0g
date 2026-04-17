import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  buildTradeRecord, 
  computeMetrics, 
  saveReputationToZeroG, 
  formatMetricsSummary 
} from './performance-tracker';
import * as zeroGStorage from './zero-g-storage';

vi.mock('./zero-g-storage', () => ({
  uploadToZeroG: vi.fn(),
}));

describe('Verifiable Reputation & Performance Tracker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseTradeParams = {
    agentName: 'eyemine.gno',
    market: 'UNI/USD',
    size: 1000,
  };

  it('should correctly calculate PnL on a winning long (buy) trade', () => {
    const trade = buildTradeRecord({
      ...baseTradeParams,
      side: 'buy',
      entryPrice: 100,
      exitPrice: 150
    });
    
    // (150 - 100) * 1000 = 50,000 realised PnL in USD
    expect(trade.pnl).toBe(50000);
    // (50 / (100 * 1000)) wait, PnL format: pnl / (entry * size)
    // 50,000 / 100,000 = 0.5 (50%)
    expect(trade.pnlPct).toBe(0.5);
  });

  it('should correctly compute overall metrics structure', () => {
    const trades = [
      buildTradeRecord({ ...baseTradeParams, side: 'buy', entryPrice: 10, exitPrice: 12, size: 500 }), // win
      buildTradeRecord({ ...baseTradeParams, side: 'sell', entryPrice: 10, exitPrice: 8, size: 500 }), // win (short)
      buildTradeRecord({ ...baseTradeParams, side: 'buy', entryPrice: 10, exitPrice: 9, size: 500 }), // loss
    ];

    const metrics = computeMetrics('eyemine.gno', trades);
    
    expect(metrics.agentName).toBe('eyemine.gno');
    expect(metrics.tradeCount).toBe(3);
    expect(metrics.winRate).toBeGreaterThan(0.6); // 2 out of 3 wins = 66%
    
    const summary = formatMetricsSummary(metrics);
    expect(summary).toContain('PnL: +');
  });

  it('should push finalized performance metrics up to 0G storage securely', async () => {
    vi.mocked(zeroGStorage.uploadToZeroG).mockResolvedValueOnce({
      cid: '0xreputation123',
      url: 'https://gateway.0g/0xreputation123'
    });

    const metrics = computeMetrics('zero-ghost.gno', []);
    const result = await saveReputationToZeroG(metrics);

    expect(zeroGStorage.uploadToZeroG).toHaveBeenCalledTimes(1);
    
    const calledArgs = vi.mocked(zeroGStorage.uploadToZeroG).mock.calls[0];
    const payloadString = calledArgs[0] as string;
    const parsedPayload = JSON.parse(payloadString);
    
    expect(parsedPayload.agentName).toBe('zero-ghost.gno');
    expect(result?.cid).toBe('0xreputation123');
  });
});
