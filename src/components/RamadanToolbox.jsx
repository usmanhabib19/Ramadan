import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, HandHeart, Calculator, Target, BookOpen } from 'lucide-react';
import DailyDuas from './DailyDuas';
import TasbeehCounter from './TasbeehCounter';
import ZakatCalculator from './ZakatCalculator';
import DailyGoals from './DailyGoals';

const RamadanToolbox = () => {
    const [activeTab, setActiveTab] = useState('duas');

    const tabs = [
        { id: 'duas', name: 'Daily Duas', icon: <BookOpen />, component: <DailyDuas /> },
        { id: 'tasbeeh', name: 'Tasbeeh', icon: <HandHeart />, component: <TasbeehCounter /> },
        { id: 'zakat', name: 'Zakat', icon: <Calculator />, component: <ZakatCalculator /> },
        { id: 'goals', name: 'Goals', icon: <Target />, component: <DailyGoals /> },
    ];

    return (
        <section id="toolbox" className="py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[120px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1e3a8a]/5 rounded-full blur-[120px] -ml-64 -mb-64" />

            <div className="container px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/20 px-4 py-2 rounded-full mb-6"
                    >
                        <LayoutGrid className="w-4 h-4 text-[#d4af37]" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#d4af37]">Spiritual Toolbox</span>
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Explore the <span className="text-[#d4af37]">Essentials</span></h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Everything you need to make the most of this blessed month, all in one place.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Tool Navigation */}
                    <div className="lg:w-1/4 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 hide-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all duration-300 min-w-[160px] lg:min-w-0 ${activeTab === tab.id
                                        ? 'bg-[#d4af37]/10 border-[#d4af37]/30 text-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.05)]'
                                        : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/[0.07]'
                                    }`}
                            >
                                <div className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : ''}`}>
                                    {React.cloneElement(tab.icon, { className: 'w-5 h-5' })}
                                </div>
                                <span className="font-bold text-sm tracking-wide">{tab.name}</span>
                                {activeTab === tab.id && (
                                    <motion.div layoutId="activeTool" className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tool Content Area */}
                    <div className="lg:w-3/4 min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                {tabs.find(t => t.id === activeTab)?.component}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RamadanToolbox;
