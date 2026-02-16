import { Clock, Sun, Sunrise, Sunset, Moon, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { Ornament } from './Decorations';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useCurrentPrayer } from '../hooks/useCurrentPrayer';

const PrayerTimes = () => {
    const { data, loading, error } = usePrayerTimes('Pakistan', 'PK');
    const nextPrayer = useCurrentPrayer(data?.timings);

    if (loading) return (
        <section id="prayer-times" className="py-24 relative overflow-hidden islamic-pattern flex justify-center items-center min-h-[400px]">
            <Loader className="w-10 h-10 text-[#d4af37] animate-spin" />
        </section>
    );

    if (error || !data) return null;

    const timings = data.timings;

    // Function to convert 24-hour time to 12-hour format
    const formatTo12Hour = (time24) => {
        // Remove timezone info if present (e.g., "14:40 (PKT)" -> "14:40")
        const cleanTime = time24.replace(/\s*\([^)]*\)/, '').trim();
        const [hours, minutes] = cleanTime.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const prayers = [
        { name: 'Fajr', time: formatTo12Hour(timings.Fajr), icon: <Sunrise className="w-5 h-5 text-amber-200" />, active: nextPrayer === 'Fajr' },
        { name: 'Dhuhr', time: formatTo12Hour(timings.Dhuhr), icon: <Sun className="w-5 h-5 text-amber-300" />, active: nextPrayer === 'Dhuhr' },
        { name: 'Asr', time: formatTo12Hour(timings.Asr), icon: <Sun className="w-5 h-5 text-amber-400" />, active: nextPrayer === 'Asr' },
        { name: 'Maghrib', time: formatTo12Hour(timings.Maghrib), icon: <Sunset className="w-5 h-5 text-orange-400" />, active: nextPrayer === 'Maghrib' },
        { name: 'Isha', time: formatTo12Hour(timings.Isha), icon: <Moon className="w-5 h-5 text-blue-300" />, active: nextPrayer === 'Isha' },
    ];

    return (
        <section id="prayer-times" className="py-24 relative overflow-hidden islamic-pattern">
            <Ornament className="absolute -top-40 -right-40 opacity-5" />
            <div className="container px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        Daily <span className="text-[#d4af37]">Prayer Times</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400"
                    >
                        Stay connected with your spiritual schedule in Pakistan
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {prayers.map((prayer, idx) => (
                        <motion.div
                            key={prayer.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`glass-card p-8 flex flex-col items-center gap-4 transition-all ${prayer.active ? 'border-[#d4af37]/50 bg-[#d4af37]/5' : ''
                                }`}
                        >
                            <div className={`p-3 rounded-full ${prayer.active ? 'bg-[#d4af37]/20' : 'bg-white/5'}`}>
                                {prayer.icon}
                            </div>
                            <h3 className="text-xl font-semibold">{prayer.name}</h3>
                            <p className={`text-2xl font-bold ${prayer.active ? 'text-[#d4af37]' : 'text-slate-300'}`}>
                                {prayer.time}
                            </p>
                            {prayer.active && (
                                <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PrayerTimes;
