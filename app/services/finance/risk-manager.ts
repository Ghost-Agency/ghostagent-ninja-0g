/// @module risk-manager
/// Phase 3: Verifiable Finance (Track 2)
/// Controls drawdown tolerances and blocks autonomous CoW DEX trades requiring HITL override.

export class RiskManager {
  /**
   * Evaluates the current daily trading risk against a strict margin threshold.
   * If the theoretical loss delta exceeds the allowed target % without user approval, blocks the trade.
   * Leveraging deterministic AI rules.
   */
  public static evaluateExecutionRisk(
    estimatedSlippageBps: number,
    dailyDrawdownPct: number,
    capitalDeployment: number,
    vaultTier: 'STANDARD' | 'VAULT' = 'STANDARD'
  ): { isApproved: boolean; reason?: string } {
    const SLIPPAGE_LIMIT = vaultTier === 'VAULT' ? 200 : 50; // 2% vs 0.5%
    const DAILY_LIMIT = vaultTier === 'VAULT' ? 10.5 : 2.5;

    if (estimatedSlippageBps > SLIPPAGE_LIMIT) {
      return { isApproved: false, reason: `Trade halted: Estimated slippage ${estimatedSlippageBps} bps exceeds tier limit of ${SLIPPAGE_LIMIT} bps.` };
    }

    if (dailyDrawdownPct > DAILY_LIMIT) {
      return { isApproved: false, reason: `Trade halted: Total daily drawdown ${dailyDrawdownPct}% violates circuit breaker threshold.` };
    }

    if (capitalDeployment > 100000 && vaultTier !== 'VAULT') {
      return { isApproved: false, reason: 'Human in the Loop override required for Standard agents exceeding $100k allocation.'};
    }

    return { isApproved: true };
  }
}
