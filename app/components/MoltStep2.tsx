'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSFX } from '../hooks/useSFX';

const BLOCKED_TLDS = ['picoclaw.gno'];

const SLD_IMAGES: Record<string, string> = {
  'molt.gno': '/sld-images/molt.png',
  'agent.gno': '/sld-images/agent.png',
  'openclaw.gno': '/sld-images/openclaw.png',
  'vault.gno': '/sld-images/vault.png',
  'nftmail.gno': '/sld-images/nftmail.png',
  'picoclaw.gno': '/sld-images/picoclaw.png',
};

const PRESET_IDENTITIES = [
  { id: 'molt', label: 'Molt', tld: 'molt.gno', description: 'Glass-box identity with full history', image: SLD_IMAGES['molt.gno'] },
  { id: 'agent', label: 'Agent', tld: 'agent.gno', description: 'Black-box autonomous agent', image: SLD_IMAGES['agent.gno'] },
  { id: 'openclaw', label: 'OpenClaw', tld: 'openclaw.gno', description: 'Transparent governance agent', image: SLD_IMAGES['openclaw.gno'] },
  { id: 'vault', label: 'Vault', tld: 'vault.gno', description: 'Terminal Safe-locked identity', image: SLD_IMAGES['vault.gno'] },
  { id: 'imago', label: 'Custom Protocol', tld: '', description: 'Specify any namespace extension', icon: '⚡' },
];

export interface TargetIdentity {
  name: string;
  tld: string;
  fullName: string;
  isPreset: boolean;
}

interface MoltStep2Props {
  sourceAgentName: string;
  onSelect: (identity: TargetIdentity) => void;
  onBack: () => void;
}

export function MoltStep2({ sourceAgentName, onSelect, onBack }: MoltStep2Props) {
  const [selected, setSelected] = useState<string>('');
  const [customName, setCustomName] = useState('');
  const [customTld, setCustomTld] = useState('molt.gno');
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { playClick, playSuccess } = useSFX();

  const preset = PRESET_IDENTITIES.find(p => p.id === selected);
  const isCustom = selected === 'imago';
  const targetName = isCustom ? customName : (selected || '');
  const targetTld = isCustom ? customTld : (preset?.tld ?? '');
  const fullTarget = targetName ? `${targetName}.${targetTld}` : '';
  const isBlocked = BLOCKED_TLDS.includes(targetTld);

  async function checkAvailability() {
    if (!targetName || !targetTld) return;
    playClick();
    setChecking(true);
    setAvailable(null);
    setError(null);
    try {
      const res = await fetch(`/api/check-name?name=${encodeURIComponent(targetName)}&tld=${encodeURIComponent(targetTld)}`);
      const data = await res.json() as any;
      setAvailable(data.available ?? false);
    } catch {
      setError('Could not check availability. Network anomaly.');
    } finally {
      setChecking(false);
    }
  }

  function handleContinue() {
    if (!targetName || !targetTld || isBlocked) return;
    playSuccess();
    onSelect({
      name: targetName,
      tld: targetTld,
      fullName: fullTarget,
      isPreset: !isCustom,
    });
  }

  const canContinue = targetName.trim().length > 0 && !isBlocked && targetName !== sourceAgentName && (isCustom ? available === true : true);

  return (
    <div className="space-y-6 relative z-10 w-full animate-fade-in-up">
      <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-2xl">
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          Initialize <span className="text-emerald-400 font-mono font-bold">{sourceAgentName}_</span> protocol. 
          Your baseline overlay will bridge while your zero-knowledge inbox state remains completely structurally intact.
        </p>

        {/* Preset options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {PRESET_IDENTITIES.map((opt) => {
            const blocked = BLOCKED_TLDS.includes(opt.tld) && opt.id !== 'imago';
            const isSelected = selected === opt.id;
            
            return (
              <motion.button
                key={opt.id}
                whileHover={!blocked ? { scale: 1.02, y: -2 } : {}}
                whileTap={!blocked ? { scale: 0.98 } : {}}
                onHoverStart={() => { if (!blocked) playClick(); }}
                onClick={() => { 
                  if (!blocked) {
                     setSelected(opt.id); 
                     setAvailable(null); 
                     setError(null); 
                     playClick();
                  } 
                }}
                disabled={blocked}
                className={`relative overflow-hidden rounded-2xl border px-3 py-4 text-left transition-all duration-300 ${
                  isSelected
                    ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-emerald-900/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                    : blocked
                    ? 'border-red-500/20 bg-red-900/10 opacity-50 cursor-not-allowed'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                }`}
              >
                {isSelected && (
                  <motion.div 
                    layoutId="activeBorder"
                    className="absolute inset-0 border-2 border-emerald-400 rounded-2xl"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <div className="flex items-center gap-3 relative z-10">
                  {opt.image ? (
                    <img src={opt.image} alt={opt.label} className="h-10 w-10 rounded-lg object-cover border border-white/10 shadow-lg" />
                  ) : opt.icon ? (
                    <div className="h-10 w-10 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center text-xl shadow-inner">
                      {opt.icon}
                    </div>
                  ) : null}
                  <div className="flex-1">
                    <div className={`text-sm font-bold ${isSelected ? 'text-emerald-300' : 'text-gray-200'}`}>{opt.label}</div>
                    <div className={`text-[9px] mt-0.5 leading-tight ${isSelected ? 'text-emerald-400/80' : 'text-gray-500'}`}>{opt.description}</div>
                  </div>
                </div>
                {opt.tld && opt.id !== 'imago' && (
                  <div className={`mt-3 px-2 py-1 rounded inline-block font-mono text-[9px] font-bold tracking-widest ${isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-black/40 text-gray-400'}`}>.{opt.tld}</div>
                )}
                {blocked && (
                  <div className="mt-3 font-mono text-[9px] text-red-500 bg-red-900/40 px-2 py-1 rounded inline-block">🔒 BLACKLISTED</div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Custom input */}
        <AnimatePresence>
          {isCustom && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 overflow-hidden mb-6 py-2 border-y border-white/5"
            >
              <div className="flex flex-col md:flex-row gap-3 pt-3">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => { setCustomName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); setAvailable(null); }}
                  placeholder="Universal pointer"
                  className="flex-1 rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition shadow-inner"
                />
                <select
                  value={customTld}
                  onChange={(e) => { setCustomTld(e.target.value); setAvailable(null); playClick(); }}
                  className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-gray-300 outline-none focus:border-emerald-500/50 appearance-none shadow-inner"
                >
                  <option value="molt.gno">.molt.gno</option>
                  <option value="agent.gno">.agent.gno</option>
                  <option value="0g">.0g (Scale Engine SpaceID)</option>
                </select>
              </div>
              <motion.button
                whileHover={customName && !checking ? { scale: 1.01 } : {}}
                whileTap={customName && !checking ? { scale: 0.98 } : {}}
                onClick={checkAvailability}
                disabled={!customName || checking}
                className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-bold uppercase tracking-widest text-emerald-400 transition hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {checking ? 'Scanning Network...' : 'Execute Ping Check'}
              </motion.button>
              
              <AnimatePresence>
                {available === true && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 text-center">
                    [✓] ROUTE ESTABLISHED: {fullTarget}
                  </motion.div>
                )}
                {available === false && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs font-mono font-bold text-red-500 bg-red-500/10 p-2 rounded-lg border border-red-500/20 text-center">
                    [!] COLLISION DETECTED: {fullTarget} is occupied
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Non-custom full name preview */}
        <AnimatePresence>
          {selected && !isCustom && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-transparent px-5 py-4 mb-6 shadow-inner flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">Molt Target Resolution: </span>
              <span className="font-mono text-base font-bold text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">{sourceAgentName}.<span className="text-gray-400">{targetTld}</span></span>
            </motion.div>
          )}
        </AnimatePresence>

        {isBlocked && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-xs text-red-400 mb-6 font-mono">
            [SYS_ERR] vault.gno is structurally restricted. Target aborted.
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-mono text-amber-500 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 mb-6 text-center">
            {error}
          </motion.div>
        )}

        {/* Bottom Actions */}
        <div className="flex gap-3 pt-2 border-t border-white/5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={playClick}
            onClick={() => { playClick(); onBack(); }}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            ← Cancel
          </motion.button>
          <motion.button
            whileHover={canContinue ? { scale: 1.02, boxShadow: '0 0 20px rgba(16,185,129,0.3)' } : {}}
            whileTap={canContinue ? { scale: 0.98 } : {}}
            onHoverStart={() => { if(canContinue) playClick(); }}
            onClick={handleContinue}
            disabled={!canContinue}
            className="flex-1 rounded-xl border border-emerald-500/40 bg-emerald-500/20 px-4 py-3.5 text-sm font-bold text-emerald-300 transition-all hover:bg-emerald-500/30 disabled:opacity-40 disabled:border-gray-500/20 disabled:bg-gray-500/10 disabled:text-gray-500 disabled:cursor-not-allowed group"
          >
            <span className="flex items-center justify-center gap-2">
              System Engage
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
          </motion.button>
        </div>

      </div>
    </div>
  );
}
