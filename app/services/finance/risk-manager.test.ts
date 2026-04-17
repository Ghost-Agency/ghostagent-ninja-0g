import { describe, it, expect } from 'vitest';
import { RiskManager } from './risk-manager';

describe('Phase 3 Verifiable Finance: Risk Analytics', () => {
  it('should approve a safe trade strictly within standard margin requirements', () => {
    const result = RiskManager.evaluateExecutionRisk(10, 1.2, 5000, 'STANDARD');
    expect(result.isApproved).toBe(true);
  });

  it('should explicitly halt execution if the slippage BPS algorithm indicates front-running MEV risk', () => {
    const result = RiskManager.evaluateExecutionRisk(80, 0, 100);
    expect(result.isApproved).toBe(false);
    expect(result.reason).toContain('exceeds tier limit of 50 bps');
  });

  it('should freeze standard 0G token bound vaults initiating dangerously large capital spikes', () => {
    const result = RiskManager.evaluateExecutionRisk(10, 0, 250000, 'STANDARD');
    expect(result.isApproved).toBe(false);
    expect(result.reason).toContain('Human in the Loop override required');
  });

  it('should permit high cap transactions organically for certified VAULT tier agents', () => {
    const result = RiskManager.evaluateExecutionRisk(10, 5, 250000, 'VAULT');
    expect(result.isApproved).toBe(true);
  });
});
