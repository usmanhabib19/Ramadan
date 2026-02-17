import { motion } from 'framer-motion';
import { Sparkles, Calendar, BookOpen, Users } from 'lucide-react';
import { Lantern, Ornament } from './Decorations';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import DigitalClock from './DigitalClock';

const Hero = ({ memberCount, liveCount, isJoined }) => {
    const { data } = usePrayerTimes('Pakistan', 'PK');
    const hijriYear = data?.date?.hijri?.year || '1447';
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 islamic-pattern">
            {/* Background with overlay */}
            <div
                className="absolute inset-0 z-0 bg-gradient-to-br from-[#050a14] via-[#0a2342] to-[#050a14]"
            />
            <div className="absolute inset-0 z-1 bg-gradient-to-b from-transparent via-[#050a14]/50 to-[#050a14]" />

            {/* Hero Lanterns */}
            <Lantern className="absolute top-10 left-10 hidden lg:block" delay={0} />
            <Lantern className="absolute top-40 right-10 hidden lg:block" delay={0.5} />
            <Lantern className="absolute top-60 left-1/4 hidden xl:block opacity-50 scale-75" delay={1} />

            {/* Ornaments */}
            <Ornament className="absolute -top-20 -left-20 scale-150 rotate-12" />
            <Ornament className="absolute -bottom-20 -right-20 scale-150 -rotate-12" />

            {/* Floating Orbs for atmosphere */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1e3a8a]/10 rounded-full blur-[120px] animate-pulse" />

            <div className="container relative z-10 px-6 text-center lg:pb-80">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center gap-4 bg-[#d4af37]/10 backdrop-blur-md border border-[#d4af37]/30 px-6 py-3 rounded-2xl mb-12 shadow-[0_0_30px_rgba(212,175,55,0.1)] relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050a14] bg-slate-800 flex items-center justify-center overflow-hidden">
                                <Users className="w-4 h-4 text-[#d4af37]/60" />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold tracking-widest uppercase text-[#d4af37]">Live Online</span>
                        </div>
                        <span className="text-sm font-bold text-white">
                            <span className="text-[#d4af37] text-lg">{(liveCount || 1).toLocaleString()}</span> Faithful Souls Online Now
                        </span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-8xl font-bold mb-6 tracking-tight leading-tight"
                >
                    {isJoined ? "Welcome Back to" : "Embrace the Spirit"} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f8f9fa] to-[#d4af37]">
                        the Ummah
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-light"
                >
                    A time for spiritual reflection, self-improvement, and heightened devotion.
                    Celebrate the month of mercy with our community resources, timings, and guide.
                </motion.p>


                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <button
                        onClick={() => {
                            document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="btn-primary flex items-center gap-2 text-lg"
                    >
                        <Calendar className="w-5 h-5" />
                        View Timetable
                    </button>
                    <button
                        onClick={() => {
                            document.getElementById('community-majlis')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-12 font-medium hover:bg-white/10 transition-all flex items-center gap-2 text-lg"
                    >
                        <Users className="w-5 h-5" />
                        {isJoined ? "Go to Majlis" : "Join Discussion"}
                    </button>
                </motion.div>

                {/* Mobile Clock - Only visible on small screens */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-16 lg:hidden"
                >
                    <DigitalClock />
                </motion.div>
            </div>

            {/* Hero Stats with Clock */}
            <div className="absolute bottom-10 left-0 right-0 z-10 hidden lg:block">
                <div className="container px-6">
                    <div className="flex justify-between items-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                        {/* Analog Clock */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            <DigitalClock />
                        </motion.div>

                        <div className="h-40 w-[1px] bg-white/10" />

                        <div className="flex flex-col">
                            <span className="text-[#d4af37] text-2xl font-bold">{hijriYear}</span>
                            <span className="text-xs uppercase tracking-widest text-slate-500">Hijri Year</span>
                        </div>
                        <div className="h-10 w-[1px] bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[#d4af37] text-2xl font-bold">Dawn to Dusk</span>
                            <span className="text-xs uppercase tracking-widest text-slate-500">Fast Duration</span>
                        </div>
                        <div className="h-10 w-[1px] bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[#d4af37] text-2xl font-bold">30 Days</span>
                            <span className="text-xs uppercase tracking-widest text-slate-500">Spiritual Journey</span>
                        </div>
                        <div className="h-10 w-[1px] bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[#d4af37] text-2xl font-bold">Holy Quran</span>
                            <span className="text-xs uppercase tracking-widest text-slate-500">Month of Revelation</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
