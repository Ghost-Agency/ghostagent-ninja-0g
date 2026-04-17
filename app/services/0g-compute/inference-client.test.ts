import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeVerifiableInference, get0GComputeBroker, clearBrokerCache } from './inference-client';

global.fetch = vi.fn();

// Mock dependencies completely so we don't accidentally leak to testnets
vi.mock('ethers', () => ({
  ethers: {
    JsonRpcProvider: vi.fn(),
    Wallet: vi.fn(),
  }
}));

vi.mock('@0glabs/0g-serving-broker', () => {
  return {
    createZGComputeNetworkBroker: vi.fn().mockResolvedValue({
      inference: {
        getServiceMetadata: vi.fn().mockResolvedValue({
          endpoint: 'https://testnet-compute.0g.ai',
          model: 'qwen3.6-plus'
        }),
        getRequestHeaders: vi.fn().mockResolvedValue({
          'Authorization': 'Bearer app-sk-mock123'
        }),
        processResponse: vi.fn().mockResolvedValue(true)
      }
    })
  };
});

describe('0G Compute Network: TEE-Verified Inference API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearBrokerCache();
    process.env.AGENT_PRIVATE_KEY = '0x0000000000000000000000000000000000000000000000000000000000000000';
  });

  const MOCK_PROVIDER = '0xProviderIdAbc123';

  it('should successfully transmit an AI payload to the 0G Compute broker and verify its cryptosignature', async () => {
    // Mock the outbound proxy LLM response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'ZG-Res-Key': 'proof-hash-999' }),
      json: async () => ({
        choices: [{ message: { content: 'This is a TEE-verified DeepSeek response!' } }]
      })
    });

    const messages = [
      { role: 'system', content: 'You are Ghost.' as const },
      { role: 'user', content: 'Analyze Phase 5 constraints.' as const }
    ] as const;

    const result = await executeVerifiableInference(MOCK_PROVIDER, [...messages]);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    
    // Check that we properly forwarded the model logic
    const fetchArgs = (global.fetch as any).mock.calls[0];
    expect(fetchArgs[0]).toBe('https://testnet-compute.0g.ai/chat/completions');
    expect(fetchArgs[1].headers['Authorization']).toBe('Bearer app-sk-mock123');

    const bodyObj = JSON.parse(fetchArgs[1].body);
    expect(bodyObj.messages[1].content).toBe('Analyze Phase 5 constraints.');
    
    // Assert the logic properly trapped and verified the TEE headers
    expect(result.content).toBe('This is a TEE-verified DeepSeek response!');
    expect(result.isVerified).toBe(true);
  });

  it('should explicitly throw an error if the AGENT_PRIVATE_KEY is missing', async () => {
    delete process.env.AGENT_PRIVATE_KEY;
    await expect(get0GComputeBroker()).rejects.toThrowError('AGENT_PRIVATE_KEY must be provided to instantiate 0G Compute brokers.');
  });
});
