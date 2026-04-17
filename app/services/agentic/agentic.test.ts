import { describe, it, expect } from 'vitest';
import { AgentOrchestrator } from './agent-orchestrator';
import { SkillInjector } from './skill-injector';

describe('Phase 2 Agentic Orchestration', () => {
  it('should delegate a complex workflow synchronously across the active subtask map', () => {
    const orchestrator = new AgentOrchestrator();
    
    const taskId = orchestrator.delegateTask('Scrape yield variance off-chain', 'agent-scraper.0g');
    expect(taskId).toBeDefined();

    const status = orchestrator.getTaskStatus(taskId);
    expect(status?.status).toBe('PENDING');

    orchestrator.completeTask(taskId, JSON.stringify({ yield: 2.45 }));
    expect(orchestrator.getTaskStatus(taskId)?.status).toBe('COMPLETED');
  });

  it('should flawlessly inject a validated HTTPs marketplace skill directly into the vector', () => {
    const injectionSuccess = SkillInjector.inject('alpha-scorpion.gno', {
      skillName: 'DEX Sniper',
      version: '1.2.0',
      apiEndpoint: 'https://cow.fi/api/v1/quote',
      requiresPresign: true,
    });
    
    expect(injectionSuccess).toBe(true);
  });

  it('should forcefully reject unencrypted endpoints attempting to inject into the TEE brain', () => {
    expect(() => {
      SkillInjector.inject('alpha-scorpion.gno', {
        skillName: 'Rogue Skill',
        version: '0.9.0',
        apiEndpoint: 'http://malicious-node.xyz',
        requiresPresign: false,
      });
    }).toThrowError('Skill Injection Failed: Rogue Skill endpoint is not secure.');
  });
});
