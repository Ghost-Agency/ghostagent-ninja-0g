'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSFX } from './hooks/useSFX';

const GHOST_LOGO = '/ghost-logo.png';

export default function Home() {
  const { playClick, playSuccess } = useSFX();

  return (
    <div className="min-h-screen bg-[#030303] relative overflow-hidden font-sans text-white">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-20%] left-[10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.15)_0%,transparent_60%)] blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.1)_0%,transparent_60%)] blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.08)_0%,transparent_70%)] blur-[90px] pointer-events-none" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-10 px-5 py-10 text-center">

        {/* Logo + Title hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative flex flex-col items-center">
            {/* Holographic Logo Container */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-amber-500/20 blur-[50px] rounded-full scale-110"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={GHOST_LOGO}
                alt="GhostAgent logo"
                className="relative z-10 h-40 w-40 object-contain drop-shadow-[0_0_35px_rgba(217,119,6,0.8)]"
              />
            </motion.div>
            
            <h1
              className="text-3xl md:text-5xl uppercase tracking-[0.12em] mt-6 relative"
              style={{ fontFamily: 'Ayuthaya, serif', color: '#f5f3e9' }}
            >
              GHOSTAGENT NINJA
            </h1>
          </div>
          
          <div className="space-y-2 max-w-xl relative mt-1">
            <div className="absolute -inset-4 bg-black/50 blur-xl rounded-full -z-10"></div>
            <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-300 to-gray-500 tracking-wide uppercase font-mono leading-tight">
              Non-custodial agent identity
            </h2>
            <p className="text-sm md:text-base text-gray-400 leading-snug font-light">
              Deploy your agent to create a persistent identity vault natively unified across <span className="text-emerald-400 font-mono font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">0G Network</span>. 
              The Smart Account is the key — transfer it to transfer absolute structural control.
            </p>
          </div>
        </motion.div>

        {/* CTA buttons */}
        <div className="flex w-full max-w-xl flex-col gap-4 mt-2">
          <motion.div whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/agents?tab=mint"
              onMouseEnter={playClick}
              onClick={playSuccess}
              className="group relative flex items-center justify-between w-full rounded-2xl border border-amber-500/30 bg-black/60 px-6 py-5 overflow-hidden backdrop-blur-xl shadow-[0_0_30px_rgba(217,119,6,0.05)] hover:shadow-[0_0_40px_rgba(217,119,6,0.2)] transition-all duration-300"
            >
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-amber-500/10 to-transparent transition-all duration-500 ease-out group-hover:w-full"></div>
              <div className="relative text-left">
                <div className="text-lg font-bold text-amber-400 tracking-wide">DEPLOY AGENT CORE</div>
                <div className="text-xs text-amber-500/60 font-mono mt-1">Initialize ERC-6551 Token Bound Account</div>
              </div>
              <svg className="w-6 h-6 text-amber-500 transition-transform group-hover:translate-x-2 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
             <Link
              href="/dashboard/marketplace"
              onMouseEnter={playClick}
              onClick={playClick}
              className="group relative flex items-center justify-between w-full rounded-2xl border border-violet-500/30 bg-black/60 px-6 py-5 overflow-hidden backdrop-blur-xl shadow-[0_0_30px_rgba(139,92,246,0.05)] hover:shadow-[0_0_40px_rgba(139,92,246,0.2)] transition-all duration-300"
            >
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-violet-500/10 to-transparent transition-all duration-500 ease-out group-hover:w-full"></div>
              <div className="relative text-left">
                <div className="text-lg font-bold text-violet-400 tracking-wide">AGENT MARKETPLACE</div>
                <div className="text-xs text-violet-500/60 font-mono mt-1">Acquire pre-trained autonomous entities</div>
              </div>
              <svg className="w-6 h-6 text-violet-500 transition-transform group-hover:translate-x-2 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="https://ghostagent.ninja/nftmail"
              onMouseEnter={playClick}
              onClick={playClick}
              className="group relative flex items-center justify-between w-full rounded-2xl border border-blue-500/30 bg-black/60 px-6 py-5 overflow-hidden backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.05)] hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-all duration-300"
            >
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-blue-600/10 to-transparent transition-all duration-500 ease-out group-hover:w-full"></div>
              <div className="relative text-left">
                <div className="text-lg font-bold text-blue-400 tracking-wide relative z-10 drop-shadow-[0_0_5px_rgba(59,130,246,0.3)]">NFTMAIL PROTOCOL</div>
                <div className="text-xs text-blue-500/60 font-mono mt-1 relative z-10">Claim sovereign zero-knowledge inbox</div>
              </div>
              <svg className="w-6 h-6 text-blue-500 transition-transform group-hover:translate-x-2 relative z-10 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </Link>
          </motion.div>
        </div>

        {/* Tagline */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-6 border-t border-white/10 pt-8 flex flex-col items-center gap-3 w-full max-w-xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-50 blur-xl"></div>
          <div className="flex gap-2 items-center text-[10px] font-mono text-gray-400">
            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded shadow-inner">01 MINT</span> <span className="text-emerald-500/50">→</span>
            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded shadow-inner">02 CYCLE</span> <span className="text-emerald-500/50">→</span>
            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded shadow-inner text-amber-500 font-bold border-amber-500/30">03 MOLT</span>
          </div>
          <p className="text-xs text-gray-600 uppercase tracking-widest font-bold mt-1">
            Zero infrastructure migration required.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
