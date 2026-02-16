import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ChevronRight, Loader } from 'lucide-react';
import { Ornament } from './Decorations';
import { useRamadanCalendar } from '../hooks/useRamadanCalendar';

const Calendar = () => {
    const [showFullCalendar, setShowFullCalendar] = useState(false);
    const { data, loading, error } = useRamadanCalendar('Pakistan', 'PK');

    const handleDownload = () => {
        window.print();
    };

    if (loading) return (
        <section id="calendar" className="py-24 bg-[#0a1324]/30 relative overflow-hidden islamic-pattern flex justify-center items-center min-h-[400px]">
            <Loader className="w-10 h-10 text-[#d4af37] animate-spin" />
        </section>
    );

    if (error) return null;

    // Ramadan starts on February 18, 2026
    const ramadanStartDate = new Date(2026, 1, 18); // Month is 0-indexed (1 = February)
    const today = new Date();

    // Calculate which day of Ramadan today is
    const diffTime = today - ramadanStartDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 because day 1 is Feb 18

    const dates = data.slice(0, showFullCalendar ? 30 : 10).map((day, idx) => {
        const dayNum = idx + 1;
        const currentDate = new Date(ramadanStartDate);
        currentDate.setDate(ramadanStartDate.getDate() + idx);

        let status = 'Upcoming';
        if (dayNum === diffDays) status = 'Today';
        if (dayNum < diffDays) status = 'Passed';

        // Format date as "18 Feb 2026"
        const formattedDate = currentDate.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        // Convert times to 12-hour format
        const formatTo12Hour = (time24) => {
            const cleanTime = time24.replace(/\s*\([^)]*\)/, '').trim();
            const [hours, minutes] = cleanTime.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minutes} ${ampm}`;
        };

        return {
            day: dayNum,
            date: formattedDate,
            sehri: formatTo12Hour(day.timings.Fajr),
            iftar: formatTo12Hour(day.timings.Maghrib),
            status
        };
    });

    return (
        <section id="calendar" className="py-24 bg-[#0a1324]/30 relative overflow-hidden islamic-pattern">
            <Ornament className="absolute -bottom-40 -left-40 opacity-5 rotate-45" />
            <div className="container px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-4xl md:text-5xl font-bold mb-4"
                        >
                            Ramadan <span className="text-[#d4af37]">Calendar</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-400"
                        >
                            Full timetable for the holy month of Ramadan 1447.
                        </motion.p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-full text-sm font-medium hover:bg-white/10 transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Save as PDF
                    </motion.button>
                </div>

                <div className="glass-card overflow-hidden">
                    <div className="grid grid-cols-5 bg-white/5 p-6 border-b border-white/5 text-xs uppercase tracking-widest font-bold text-slate-500">
                        <div>Ramadan</div>
                        <div>Date</div>
                        <div>Sehri (Ends)</div>
                        <div>Iftar (Starts)</div>
                        <div className="text-right">Status</div>
                    </div>
                    <div className="divide-y divide-white/5">
                        {dates.map((item, idx) => (
                            <motion.div
                                key={item.day}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`grid grid-cols-5 p-6 items-center transition-colors hover:bg-white/[0.02] ${item.status === 'Today' ? 'bg-[#d4af37]/5 border-l-2 border-[#d4af37]' : ''
                                    }`}
                            >
                                <div className="font-medium">Day {item.day}</div>
                                <div className="text-slate-400">{item.date}</div>
                                <div className="text-[#d4af37] font-mono">{item.sehri}</div>
                                <div className="text-[#d4af37] font-mono">{item.iftar}</div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${item.status === 'Today' ? 'bg-[#d4af37] text-[#050a14]' :
                                        item.status === 'Passed' ? 'bg-white/5 text-slate-500' : 'bg-white/10 text-slate-300'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="p-6 bg-white/5 text-center">
                        <button
                            onClick={() => setShowFullCalendar(!showFullCalendar)}
                            className="text-[#d4af37] text-sm font-semibold flex items-center justify-center gap-1 mx-auto hover:underline transition-all"
                        >
                            {showFullCalendar ? 'Show Less' : 'View Full 30-Day Calendar'}
                            <ChevronRight className={`w-4 h-4 transition-transform ${showFullCalendar ? 'rotate-90' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Calendar;
