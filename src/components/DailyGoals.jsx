import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, Circle, Trophy } from 'lucide-react';

const DailyGoals = () => {
    const [goals, setGoals] = useState(() => {
        const saved = localStorage.getItem('ramadan-goals');
        return saved ? JSON.parse(saved) : [
            { id: 1, text: "Perform all 5 obligatory prayers", completed: false },
            { id: 2, text: "Read at least 1 Juz/Page of Quran", completed: false },
            { id: 3, text: "Give Sadaqah (Charity)", completed: false },
            { id: 4, text: "Complete Morning/Evening Adhkar", completed: false },
            { id: 5, text: "Avoid negative talk & anger", completed: false }
        ];
    });

    useEffect(() => {
        localStorage.setItem('ramadan-goals', JSON.stringify(goals));
    }, [goals]);

    const toggleGoal = (id) => {
        setGoals(prev => prev.map(goal =>
            goal.id === id ? { ...goal, completed: !goal.completed } : goal
        ));
    };

    const completedCount = goals.filter(g => g.completed).length;
    const progress = (completedCount / goals.length) * 100;

    return (
        <div className="flex flex-col h-full bg-[#0a1324] rounded-3xl p-8 border border-white/5">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#d4af37]/10 rounded-xl flex items-center justify-center text-[#d4af37]">
                        <Target className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold">Daily <span className="text-[#d4af37]">Goals</span></h3>
                </div>
                <div className="flex items-center gap-2">
                    <Trophy className={`w-5 h-5 transition-all ${progress === 100 ? 'text-[#d4af37] scale-125' : 'text-slate-700'}`} />
                    <span className="text-xs font-bold text-slate-500">{completedCount}/{goals.length}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-white/5 rounded-full mb-8 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-[#d4af37] to-[#b8860b] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                />
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {goals.map((goal) => (
                    <motion.div
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className={`group cursor-pointer rounded-2xl p-4 transition-all duration-300 flex items-center gap-4 ${goal.completed ? 'bg-green-500/5 border border-green-500/10' : 'bg-white/5 border border-white/5 hover:border-white/10'}`}
                    >
                        <div className={`transition-all duration-300 ${goal.completed ? 'text-green-500' : 'text-slate-600 group-hover:text-slate-400'}`}>
                            {goal.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                        </div>
                        <span className={`text-sm transition-all duration-300 ${goal.completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                            {goal.text}
                        </span>
                    </motion.div>
                ))}
            </div>

            {progress === 100 && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-[#d4af37] text-xs font-bold mt-6 uppercase tracking-widest"
                >
                    MashaAllah! All goals completed.
                </motion.p>
            )}
        </div>
    );
};

export default DailyGoals;
