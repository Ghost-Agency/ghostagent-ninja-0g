/// @module revenue-splitter
/// Phase 4: Agent Economy (Track 3 & 4)
/// Automates split payouts utilizing 0G inferences.

export class RevenueSplitter {
  /**
   * Natively calculates and partitions the x402 Micropayment payout 
   * between the Hardware Provider (0G API node) and the Agent Developer.
   */
  public static distributePayout(grossInferenceTokenAmount: number): { hardwareFee: number, developerRoyalty: number, platformFee: number } {
    // Platform takes 1% rake
    const platformFee = grossInferenceTokenAmount * 0.01;
    const distributable = grossInferenceTokenAmount - platformFee;
    
    // 60-40 split favoring the Developer 
    const developerRoyalty = distributable * 0.6;
    const hardwareFee = distributable * 0.4;
    
    return {
      hardwareFee,
      developerRoyalty,
      platformFee
    };
  }
}
