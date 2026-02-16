import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const duads = [
    {
        title: "Dua for Fasting (Suhoor)",
        arabic: "وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
        transliteration: "Wa bi-sawmi ghadinn nawaytu min shahri Ramadan",
        meaning: "I intend to keep the fast for tomorrow in the month of Ramadan."
    },
    {
        title: "Dua for Breaking Fast (Iftar)",
        arabic: "اللَّهُمَّ اِنِّى لَكَ صُمْتُ وَبِكَ اَمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ اَفْطَرْتُ",
        transliteration: "Allahumma inni laka sumtu, wa bika aamantu, wa 'alayka tawakkaltu, wa 'ala rizqika aftartu",
        meaning: "O Allah! I fasted for You and I believe in You and I put my trust in You and with the sustenance You have given me I now break my fast."
    },
    {
        title: "Dua for First 10 Days (Mercy)",
        arabic: "رَبِّ اغْفِرْ وَارْحَمْ وَأَنْتَ خَيْرُ الرَّاحِمِينَ",
        transliteration: "Rabbi-ghfir war-ham wa Anta khayru-r-rahimeen",
        meaning: "O my Lord! Forgive and have mercy, for You are the Best of those who show mercy."
    },
    {
        title: "Dua for Second 10 Days (Forgiveness)",
        arabic: "أَسْتَغْفِرُ اللهَ رَبِّي مِنْ كُلِّ ذَنْبٍ وَأَتُوبُ إِلَيْهِ",
        transliteration: "Astaghfirullaha Rabbi min kulli dhanbin wa atubu ilayh",
        meaning: "I seek forgiveness from Allah, my Lord, from every sin and I turn to Him."
    },
    {
        title: "Dua for Last 10 Days (Safety from Fire)",
        arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
        transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
        meaning: "O Allah, You are Most Forgiving, and You love forgiveness; so forgive me."
    }
];

const DailyDuas = () => {
    const [currentIdx, setCurrentIdx] = useState(0);

    const nextDua = () => setCurrentIdx((prev) => (prev + 1) % duads.length);
    const prevDua = () => setCurrentIdx((prev) => (prev - 1 + duads.length) % duads.length);

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#d4af37]/10 rounded-xl flex items-center justify-center text-[#d4af37]">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold">Daily <span className="text-[#d4af37]">Duas</span></h3>
                </div>
                <div className="flex gap-2">
                    <button onClick={prevDua} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextDua} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIdx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full flex flex-col items-center text-center justify-center relative group"
                    >
                        <Quote className="absolute top-6 left-6 w-8 h-8 text-[#d4af37]/10 group-hover:text-[#d4af37]/20 transition-colors" />

                        <h4 className="text-[#d4af37] text-xs font-black uppercase tracking-[4px] mb-6">{duads[currentIdx].title}</h4>

                        <p className="text-3xl md:text-4xl font-bold mb-8 leading-loose text-white font-arabic" dir="rtl">
                            {duads[currentIdx].arabic}
                        </p>

                        <div className="space-y-4 max-w-md">
                            <p className="text-sm italic text-slate-400 leading-relaxed">
                                "{duads[currentIdx].transliteration}"
                            </p>
                            <p className="text-sm text-slate-300 font-medium">
                                {duads[currentIdx].meaning}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex justify-center gap-2 mt-6">
                {duads.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIdx ? 'w-8 bg-[#d4af37]' : 'w-2 bg-white/10'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default DailyDuas;
