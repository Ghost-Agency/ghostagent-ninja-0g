import { describe, it, expect, vi, beforeEach } from 'vitest';
import { persistMemoryContext, retrieveMemoryContext, AgentMemoryContext } from './memory-manager';
import * as zeroGStorage from '../zero-g-storage';

// Mock the 0G storage adapter so we don't make real network requests in unit tests
vi.mock('../zero-g-storage', () => ({
  uploadToZeroG: vi.fn(),
  zeroGGatewayUrl: vi.fn(),
}));

// Mock global fetch for retrieveMemoryContext
global.fetch = vi.fn();

describe('Agent Memory Manager (0G Storage)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockContext: AgentMemoryContext[] = [
    { role: 'system', content: 'You are an autonomous agent.', timestamp: 1000 },
    { role: 'user', content: 'What is your operational scope?', timestamp: 1005 }
  ];

  describe('persistMemoryContext', () => {
    it('should correctly format and push memory context to 0G storage', async () => {
      // Setup mock return
      vi.mocked(zeroGStorage.uploadToZeroG).mockResolvedValueOnce({
        cid: '0xmockcid123',
        url: 'https://storage.0g/0xmockcid123'
      });

      const pointer = await persistMemoryContext('test-agent.gno', mockContext);

      expect(zeroGStorage.uploadToZeroG).toHaveBeenCalledTimes(1);
      
      // Check the payload wrapper
      const calledArgs = vi.mocked(zeroGStorage.uploadToZeroG).mock.calls[0];
      const payloadString = calledArgs[0] as string;
      const parsedPayload = JSON.parse(payloadString);
      
      expect(parsedPayload.agent).toBe('test-agent.gno');
      expect(parsedPayload.memory).toEqual(mockContext);

      // Verify the returned pointer
      expect(pointer?.rootCid).toBe('0xmockcid123');
      expect(pointer?.agentName).toBe('test-agent.gno');
    });

    it('should throw an error if context is empty', async () => {
      await expect(persistMemoryContext('test-agent', [])).rejects.toThrow('Memory context cannot be empty');
    });

    it('should throw an error if 0G upload fails', async () => {
      vi.mocked(zeroGStorage.uploadToZeroG).mockResolvedValueOnce(null);
      await expect(persistMemoryContext('test-agent', mockContext)).rejects.toThrow('Failed to persist memory onto 0G Storage');
    });
  });

  describe('retrieveMemoryContext', () => {
    it('should fetch and parse memory context from 0G gateway', async () => {
      vi.mocked(zeroGStorage.zeroGGatewayUrl).mockReturnValueOnce('https://storage.0g/0xmockcid123');
      
      // Mock fetch response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ agent: 'test-agent.gno', memory: mockContext, created: 2000 })
      });

      const memory = await retrieveMemoryContext('0xmockcid123');

      expect(zeroGStorage.zeroGGatewayUrl).toHaveBeenCalledWith('0xmockcid123');
      expect(global.fetch).toHaveBeenCalledWith('https://storage.0g/0xmockcid123');
      expect(memory).toEqual(mockContext);
    });

    it('should throw an error if fetch fails', async () => {
      vi.mocked(zeroGStorage.zeroGGatewayUrl).mockReturnValueOnce('https://storage.0g/0xbadcid');
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(retrieveMemoryContext('0xbadcid')).rejects.toThrow('HTTP 404');
    });
  });
});
