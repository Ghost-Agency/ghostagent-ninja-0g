'use client';

import Link from 'next/link';

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-24 pt-10 px-5">
      
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-[#f2eee4]">How It Works (FAQ)</h1>
        <p className="text-[var(--muted)] text-sm leading-relaxed max-w-2xl">
          GhostAgent turns your NFT into a master key for an autonomous agent. 
          Here's a simple, step-by-step breakdown of how the architecture works and what happens when you buy or sell an agent.
        </p>
      </div>

      {/* Visual Tutorial */}
      <div className="rounded-2xl border border-[rgba(176,128,92,0.3)] bg-black/40 p-8 space-y-8">
        <h2 className="text-xl font-bold text-amber-400">The 3-Step Architecture</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <div className="space-y-3 relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-2xl">
              🔑
            </div>
            <h3 className="text-sm font-bold text-white">1. The NFT is the Key</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              When you mint or "molt" an agent, you get an NFT. This NFT isn't just a picture—it is the literal master password to the entire system. Whoever holds this NFT in their wallet owns the agent.
            </p>
            {/* Connector arrow (desktop) */}
            <div className="hidden md:block absolute top-6 -right-5 text-[var(--muted)]">→</div>
          </div>

          {/* Step 2 */}
          <div className="space-y-3 relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-2xl">
              🏦
            </div>
            <h3 className="text-sm font-bold text-white">2. The Gnosis Safe</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              The NFT controls a "Token Bound Account" (an ERC-6551 wallet). This wallet acts as a Gnosis Safe. It holds the agent's funds (xDAI, HOST) and executes on-chain transactions.
            </p>
            {/* Connector arrow (desktop) */}
            <div className="hidden md:block absolute top-6 -right-5 text-[var(--muted)]">→</div>
          </div>

          {/* Step 3 */}
          <div className="space-y-3 relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-2xl">
              📬
            </div>
            <h3 className="text-sm font-bold text-white">3. The Inbox & Data</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              The Safe is hard-wired to an email inbox (via <strong>nftmail.box</strong>) and the agent's memory. All emails, OTPs, and memories belong to the Safe.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion or List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#f2eee4]">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          
          <div className="rounded-xl border border-[var(--border)] bg-black/20 p-5 space-y-2">
            <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              If I sell my NFT, does the new owner get my emails?
            </h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              <strong>Yes.</strong> Because the NFT controls the Gnosis Safe, and the Safe controls the inbox, transferring the NFT transfers the <em>entire email inbox, history, and all OTP logins</em>. The new owner inherits the account exactly as you left it.
            </p>
            <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <span className="text-xs font-semibold text-red-400">🔥 How to protect yourself:</span>
              <p className="text-xs text-red-300 mt-1">
                If you are selling an agent but want your emails deleted, you MUST use the <a href="https://nftmail.box/dashboard" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-200">Sovereign Burn</a> feature on the dashboard <em>before</em> transferring the NFT. This permanently wipes the inbox.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-black/20 p-5 space-y-2">
            <h3 className="text-sm font-bold text-white">What is "Molting"?</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Molting is like a snake shedding its skin. When you Molt, you upgrade your agent's identity or attach a completely different NFT (like an ENS name or a Chonk) to act as the new master key. Your underlying Safe, email inbox, and history remain untouched—only the "key" (the NFT) changes.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-black/20 p-5 space-y-2">
            <h3 className="text-sm font-bold text-white">Can I use my old ENS name as my Agent?</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              <strong>Yes!</strong> By using the "BYO NFT" feature, you can overlay an existing ENS name or supported NFT collection onto your GhostAgent identity. This increases the utility and value of your legacy NFTs by turning them into autonomous agents with fully functional inboxes.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-black/20 p-5 space-y-2">
            <h3 className="text-sm font-bold text-white">Who has custody of my Agent's money?</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              <strong>You do.</strong> The system is entirely non-custodial. The funds sit in a Gnosis Safe smart contract on the blockchain. The only way to access those funds is by proving you own the parent NFT. Neither GhostAgent.ninja nor Eyemine Pty Ltd can touch your assets.
            </p>
          </div>

        </div>
      </div>

      <div className="flex justify-center pt-8">
        <Link 
          href="/dashboard"
          className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-6 py-3 text-sm font-bold text-amber-400 transition hover:bg-amber-500/20"
        >
          Go to Dashboard →
        </Link>
      </div>

    </div>
  );
}