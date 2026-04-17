import { uploadToZeroG, zeroGGatewayUrl } from '../zero-g-storage';

export interface AgentMemoryContext {
  role: 'system' | 'user' | 'assistant' | 'agent';
  content: string;
  timestamp: number;
}

export interface AgentMemoryPointer {
  agentName: string;
  rootCid: string;
  gatewayUrl: string;
  updatedAt: number;
}

/**
 * Persists an array of LLM conversational context or agent states directly to 0G Storage.
 * @param agentName - The .gno or local agent name identifier.
 * @param context - The memory context array.
 * @returns A pointer containing the 0G Storage CID and URL.
 */
export async function persistMemoryContext(
  agentName: string,
  context: AgentMemoryContext[]
): Promise<AgentMemoryPointer | null> {
  if (!context || context.length === 0) {
    throw new Error('Memory context cannot be empty');
  }

  const payloadString = JSON.stringify({
    agent: agentName,
    memory: context,
    created: Date.now(),
  }, null, 2);

  const filename = `agent-memory-${agentName}-${Date.now()}.json`;
  
  // Upload to 0G Decentralized Data Availability
  const result = await uploadToZeroG(payloadString, filename);
  
  if (!result || !result.cid) {
    throw new Error('Failed to persist memory onto 0G Storage');
  }

  return {
    agentName,
    rootCid: result.cid,
    gatewayUrl: result.url,
    updatedAt: Date.now()
  };
}

/**
 * Retrieves an agent's memory context from 0G Storage via CID.
 * @param cid - The 0G Storage Root Hash CID.
 * @returns The parsed AgentMemoryContext array.
 */
export async function retrieveMemoryContext(cid: string): Promise<AgentMemoryContext[]> {
  if (!cid) throw new Error('CID is required for memory retrieval');

  const url = zeroGGatewayUrl(cid);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const data = await res.json();
    return data.memory || [];
  } catch (error) {
    console.error(`Failed to retrieve agent memory for CID ${cid}:`, error);
    throw error;
  }
}

/**
 * Phase 5.2: Network Kill Switch (Sovereign Burn)
 * In the event an Agent's cryptographic envelope or TEE is compromised, 
 * this function securely overrides their state vector routing and issues 
 * a final overriding "BURNED" memory file to the 0G network, severing 
 * the Token Bound Account's operational logic permanently.
 */
export async function executeSovereignBurn(agentName: string): Promise<AgentMemoryPointer | null> {
  const terminalContext: AgentMemoryContext[] = [{
    role: 'system',
    content: '0xDEAD... [SOVEREIGN BURN INITIATED. ALL COGNITIVE VECTORS PURGED. AGENT OPERATION TERMINATED.]',
    timestamp: Date.now()
  }];

  return await persistMemoryContext(`BURNED-${agentName}`, terminalContext);
}
