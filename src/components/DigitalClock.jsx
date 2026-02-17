import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import API_URL from '../apiConfig';

const DigitalClock = () => {
    const [time, setTime] = useState(new Date());
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const syncTime = async () => {
            try {
                const start = Date.now();
                const res = await fetch(`${API_URL}/api/time`);
                const data = await res.json();
                const end = Date.now();
                const latency = (end - start) / 2;
                setOffset(data.timestamp - (end - latency));
            } catch (err) {
                console.error('Failed to sync with server time');
            }
        };

        syncTime();

        const timer = setInterval(() => {
            const now = new Date();
            now.setMilliseconds(now.getMilliseconds() + offset);
            setTime(now);
        }, 1000);

        return () => clearInterval(timer);
    }, [offset]);

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    // Format with leading zeros
    const formatNumber = (num) => num.toString().padStart(2, '0');

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Digital Time Display */}
            <div className="flex items-center gap-2 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a14] border-2 border-[#d4af37] rounded-2xl px-8 py-6 shadow-2xl">
                <Clock className="w-6 h-6 text-[#d4af37]" />
                <div className="flex items-baseline gap-1">
                    {/* Hours */}
                    <motion.span
                        key={displayHours}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl font-bold text-[#d4af37] font-mono tabular-nums"
                    >
                        {formatNumber(displayHours)}
                    </motion.span>

                    {/* Blinking Colon */}
                    <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-5xl font-bold text-[#d4af37]"
                    >
                        :
                    </motion.span>

                    {/* Minutes */}
                    <motion.span
                        key={minutes}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl font-bold text-[#d4af37] font-mono tabular-nums"
                    >
                        {formatNumber(minutes)}
                    </motion.span>

                    {/* Blinking Colon */}
                    <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-5xl font-bold text-[#d4af37]"
                    >
                        :
                    </motion.span>

                    {/* Seconds */}
                    <motion.span
                        key={seconds}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl font-bold text-white font-mono tabular-nums"
                    >
                        {formatNumber(seconds)}
                    </motion.span>

                    {/* AM/PM */}
                    <span className="text-xl font-bold text-slate-400 ml-2 self-start mt-1">
                        {ampm}
                    </span>
                </div>
            </div>

            {/* Date and Location */}
            <div className="text-center">
                <div className="text-sm text-slate-400 uppercase tracking-widest">
                    {time.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
                <div className="text-xs text-[#d4af37] uppercase tracking-widest mt-1">
                    Pakistan Time (PKT)
                </div>
            </div>
        </div>
    );
};

export default DigitalClock;
