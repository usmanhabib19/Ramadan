import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Plus, Fingerprint } from 'lucide-react';

const TasbeehCounter = () => {
    const [count, setCount] = useState(0);
    const [target, setTarget] = useState(33);

    const increment = () => {
        setCount(prev => prev + 1);
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    };

    const reset = () => {
        setCount(0);
    };

    return (
        <div className="flex flex-col h-full bg-[#0a1324] rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#d4af37]/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#d4af37]/30 transition-all duration-700" />

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#d4af37]/10 rounded-xl flex items-center justify-center text-[#d4af37]">
                        <Fingerprint className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold">Tasbeeh <span className="text-[#d4af37]">Counter</span></h3>
                </div>
                <button onClick={reset} className="p-2 text-slate-500 hover:text-[#d4af37] transition-all bg-white/5 rounded-lg active:rotate-180">
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative mb-8">
                    <motion.div
                        key={count}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-8xl font-black text-white font-mono tracking-tighter"
                    >
                        {count.toString().padStart(2, '0')}
                    </motion.div>
                    <div className="text-center text-xs uppercase tracking-[3px] text-slate-500 font-bold mt-2">
                        Goal: {target}
                    </div>
                </div>

                <div className="flex gap-4 mb-10">
                    {[33, 99, 100].map(t => (
                        <button
                            key={t}
                            onClick={() => setTarget(t)}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${target === t ? 'bg-[#d4af37] text-[#050a14]' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <button
                    onClick={increment}
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8860b] p-1 shadow-[0_0_40px_rgba(212,175,55,0.3)] active:scale-95 transition-all group/btn relative"
                >
                    <div className="w-full h-full rounded-full bg-[#050a14] flex items-center justify-center group-hover/btn:bg-transparent transition-all">
                        <Plus className="w-12 h-12 text-[#d4af37] group-hover/btn:text-[#050a14] transition-all" />
                    </div>
                    {/* Pulsing Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-[#d4af37] animate-ping opacity-20 pointer-events-none" />
                </button>

                <p className="mt-8 text-xs text-slate-500 font-medium">Click the button to count</p>
            </div>
        </div>
    );
};

export default TasbeehCounter;
