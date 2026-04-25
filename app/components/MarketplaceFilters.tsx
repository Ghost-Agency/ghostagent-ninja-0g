'use client';

export type DomainFilter  = 'all' | 'agent.gno' | 'openclaw.gno' | 'molt.gno' | 'picoclaw.gno' | 'vault.gno' | 'nftmail.gno';
export type LevelFilter   = 'all' | 'larva' | 'pupa' | 'imago' | 'ghost';
export type PrivacyFilter = 'all' | 'glassbox' | 'private';
export type TypeFilter    = 'all' | 'service' | 'body' | 'bundle';
export type CatFilter     = 'all' | 'data' | 'defi' | 'social' | 'content';

export interface Filters {
  type:    TypeFilter;
  cat:     CatFilter;
  domain:  DomainFilter;
  level:   LevelFilter;
  privacy: PrivacyFilter;
}
import { motion } from 'framer-motion';
import { useSFX } from '../hooks/useSFX';

interface MarketplaceFiltersProps {
  filters: Filters;
  onChange: (next: Partial<Filters>) => void;
  counts: {
    total: number;
    filtered: number;
  };
}

const TYPE_TABS: { value: TypeFilter; label: string }[] = [
  { value: 'all',     label: 'All' },
  { value: 'service', label: 'Hire' },
  { value: 'body',    label: 'Agent Bodies' },
  { value: 'bundle',  label: 'Bundles' },
];

const DOMAIN_TABS: { value: DomainFilter; label: string; color: string; border: string; bgGlow: string }[] = [
  { value: 'all',          label: 'All domains',    color: 'text-[var(--muted)]', border: 'border-white/10', bgGlow: '' },
  { value: 'agent.gno',    label: 'agent.gno',      color: 'text-blue-300',     border: 'border-blue-500/50', bgGlow: 'bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]' },
  { value: 'openclaw.gno', label: 'openclaw.gno',   color: 'text-rose-300',     border: 'border-rose-500/50', bgGlow: 'bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.3)]' },
  { value: 'molt.gno',     label: 'molt.gno',       color: 'text-violet-300',   border: 'border-violet-500/50', bgGlow: 'bg-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.3)]' },
  { value: 'picoclaw.gno', label: 'picoclaw.gno',   color: 'text-amber-300',    border: 'border-amber-500/50', bgGlow: 'bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.3)]' },
  { value: 'vault.gno',    label: 'vault.gno',      color: 'text-emerald-300',  border: 'border-emerald-500/50', bgGlow: 'bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]' },
  { value: 'nftmail.gno',  label: 'nftmail.gno',    color: 'text-cyan-300',     border: 'border-cyan-500/50', bgGlow: 'bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]' },
];

const LEVEL_TABS: { value: LevelFilter; label: string; icon: string; glow: string }[] = [
  { value: 'all',   label: 'Any level', icon: '', glow: '' },
  { value: 'larva', label: 'Larva', icon: '/levels/larva.png', glow: 'text-zinc-300 shadow-[0_0_10px_rgba(161,161,170,0.2)]' },
  { value: 'pupa',  label: 'Pupa',  icon: '/levels/pupa.png', glow: 'text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]' },
  { value: 'imago', label: 'Imago', icon: '/levels/imago.png', glow: 'text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.2)]' },
  { value: 'ghost', label: 'Ghost', icon: '/levels/ghost.png', glow: 'text-fuchsia-300 shadow-[0_0_10px_rgba(217,70,239,0.2)]' },
];

const PRIVACY_TABS: { value: PrivacyFilter; label: string; text: string; glow: string }[] = [
  { value: 'all',       label: 'Any privacy', text: 'text-zinc-400', glow: '' },
  { value: 'glassbox',  label: '🔍 Glass Box', text: 'text-sky-300', glow: 'shadow-[0_0_10px_rgba(56,189,248,0.2)]' },
  { value: 'private',   label: '🔒 Private', text: 'text-violet-300', glow: 'shadow-[0_0_10px_rgba(139,92,246,0.2)]' },
];

const Divider = () => (
  <div className="mx-2 w-px self-stretch bg-white/10" />
);

export function MarketplaceFilters({ filters, onChange, counts }: MarketplaceFiltersProps) {
  const { playClick, playMoltSequence } = useSFX();

  const handleFilterClick = (update: Partial<Filters>) => {
    playClick();
    onChange(update);
  };

  const handleClear = () => {
    playMoltSequence();
    onChange({ type: 'all', cat: 'all', domain: 'all', level: 'all', privacy: 'all' });
  };

  return (
    <div className="space-y-3 font-sans relative z-10 w-full backdrop-blur-md rounded-2xl border border-white/5 bg-black/40 p-4 shadow-xl">
      {/* Row 1: type */}
      <div className="flex flex-wrap items-center gap-2">
        {TYPE_TABS.map(t => {
          const active = filters.type === t.value;
          return (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={t.value} 
              className={`rounded-xl px-4 py-2 text-xs font-bold tracking-wide transition-all ${
                active
                  ? 'bg-gradient-to-r from-amber-500/20 to-amber-700/20 text-amber-400 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
              }`} 
              onClick={() => handleFilterClick({ type: t.value })}
            >
              {t.label}
            </motion.button>
          )
        })}
      </div>

      {/* Row 2: domain */}
      <div className="flex flex-wrap items-center gap-2">
        {DOMAIN_TABS.map(d => {
          const active = filters.domain === d.value;
          return (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={d.value}
              onClick={() => handleFilterClick({ domain: d.value })}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all border ${
                active
                  ? `${d.bgGlow} ${d.color} ${d.border}`
                  : `bg-white/5 text-[var(--muted)] border-white/10 hover:text-white hover:bg-white/10`
              }`}
            >
              {d.label}
            </motion.button>
          )
        })}
      </div>

      {/* Row 3: level + privacy */}
      <div className="flex flex-wrap items-center gap-2">
        {LEVEL_TABS.map(l => {
          const active = filters.level === l.value;
          return (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={l.value} 
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all border ${
                active
                  ? `bg-white/10 border-white/30 ${l.glow}`
                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
              }`} 
              onClick={() => handleFilterClick({ level: l.value })}
            >
              {l.icon
                ? <span className="inline-flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={l.icon} alt={l.label} className="h-4 w-4 drop-shadow-md" />
                    {l.label}
                  </span>
                : l.label
              }
            </motion.button>
          )
        })}

        <Divider />

        {PRIVACY_TABS.map(p => {
          const active = filters.privacy === p.value;
          return (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={p.value} 
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all border ${
                active 
                  ? `bg-white/10 border-white/30 ${p.text} ${p.glow}`
                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
              }`} 
              onClick={() => handleFilterClick({ privacy: p.value })}
            >
              {p.label}
            </motion.button>
          )
        })}
      </div>

      {/* Result count */}
      {(filters.domain !== 'all' || filters.level !== 'all' || filters.privacy !== 'all' || filters.type !== 'all') && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-3 pt-2 text-[11px] font-mono font-bold text-gray-500"
        >
          <span className="bg-white/5 px-2 py-1 rounded">MATCHES: {counts.filtered} / {counts.total}</span>
          <button
            onClick={handleClear}
            className="text-amber-500 hover:text-amber-400 uppercase tracking-widest transition"
          >
            Clear Filters ×
          </button>
        </motion.div>
      )}
    </div>
  );
}
