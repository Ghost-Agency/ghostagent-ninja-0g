import { type Address } from 'viem';
import { executeTrade, getTokenPriceInXdai, DexTradeResult } from './cow-dex';
import { WXDAI } from './trade-intent';

// Mock Yield Token (sDAI on Gnosis)
export const SDAI_GNOSIS = '0xaf204776c7245bF4147c2612BF6e5972Ee483701';

export interface YieldRouteResult {
  estimatedApy: number;
  trade: DexTradeResult;
}

/**
 * Sweeps idle Agent Stablecoins automatically into the highest yielding native vault.
 * Currently fixed to sDAI (Savings xDAI) which yields the MakerDAO DSR rate natively on Gnosis.
 */
export async function sweepToYieldVault(
  agentSafeAddress: Address, 
  idleWxdaiAmount: string 
): Promise<YieldRouteResult | null> {
  if (BigInt(idleWxdaiAmount) === 0n) return null;

  // Phase 3: Autonomous routing metric. We mock the APR for the hackathon but normally
  // we would fetch the dynamic Maker DSR rate directly from the sDAI contract.
  const estimatedApy = 5.0; // 5% APR

  const trade = await executeTrade({
    from: agentSafeAddress,
    sellToken: WXDAI,
    buyToken: SDAI_GNOSIS,
    sellAmount: idleWxdaiAmount,
    tradeIntentSig: '0x', // Presigned via EIP-1271 Smart Account
  });

  return { estimatedApy, trade };
}

/**
 * Withdraws funds out of the autonomous yield pool back to standard WXDAI
 * in order to fulfill an impending x402 payment constraint.
 */
export async function retrieveFromYieldVault(
  agentSafeAddress: Address,
  sdaiAmountToSell: string
): Promise<DexTradeResult | null> {
  if (BigInt(sdaiAmountToSell) === 0n) return null;

  const trade = await executeTrade({
    from: agentSafeAddress,
    sellToken: SDAI_GNOSIS,
    buyToken: WXDAI,
    sellAmount: sdaiAmountToSell,
    kind: 'sell',
    tradeIntentSig: '0x',
  });

  return trade;
}
