import { describe, it, expect, vi, beforeEach } from 'vitest';
// We mock out fetch entirely since fetch wrapper heavily modifies it
global.fetch = vi.fn();

import { deliverA2AMessage, createX402Fetch, getAgentFetch } from './x402-client';

describe('x402 Micropayments Protocol', () => {

  const MOCK_PRIVATE_KEY = '0x1234567812345678123456781234567812345678123456781234567812345678';
  
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.AGENT_PRIVATE_KEY;
  });

  it('should fallback to normal fetch if no AGENT_PRIVATE_KEY is supplied', () => {
    const defaultFetch = getAgentFetch();
    expect(defaultFetch).toBe(global.fetch);
  });

  it('should correctly format an A2A delivery payload for the x402-gated inbox', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ txHash: '0xabc123' })
    });

    const payload = {
      fromAgent: 'sender.gno',
      toAgent: 'receiver.gno',
      subject: 'Phase 4 Strategy',
      body: 'Executing micropayments module now.'
    };

    const res = await deliverA2AMessage(payload, 'http://localhost');

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(res.success).toBe(true);
    expect(res.txHash).toBe('0xabc123');

    const fetchArgs = (global.fetch as any).mock.calls[0];
    expect(fetchArgs[0]).toContain('/api/x402/deliver');
    const fetchPayload = JSON.parse(fetchArgs[1].body);
    expect(fetchPayload.subject).toBe('Phase 4 Strategy');
  });

  it('should trap failed x402 deliveries gracefully', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 402,
      statusText: 'Payment Required',
      json: async () => ({ error: 'Insufficient x402 funds' })
    });

    const res = await deliverA2AMessage({ fromAgent: 'bad', toAgent: 'bot', subject: '', body: '' });

    expect(res.success).toBe(false);
    expect(res.error).toBe('Insufficient x402 funds');
  });

});
