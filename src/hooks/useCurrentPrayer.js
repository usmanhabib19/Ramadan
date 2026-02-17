import { useState, useEffect } from 'react';

/**
 * Custom hook to determine the current/next prayer based on real-time
 * @param {Object} timings - Prayer timings object from Aladhan API
 * @returns {string} - Name of the current/next prayer
 */
/**
 * Custom hook to determine the current/next prayer based on real-time
 * @param {Object} timings - Prayer timings object from Aladhan API
 * @returns {Object} - { currentPrayer, countdown, currentTime }
 */
export const useCurrentPrayer = (timings) => {
    const [prayerInfo, setPrayerInfo] = useState({
        currentPrayer: 'Fajr',
        countdown: '00:00:00',
        currentTime: new Date().toLocaleTimeString()
    });

    useEffect(() => {
        if (!timings) return;

        const updateInfo = () => {
            const now = new Date();
            const currentTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
            const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

            // Parse prayer times (format: "HH:MM (TZ)")
            const parsePrayerTime = (timeStr) => {
                if (!timeStr) return 0;
                const cleanTime = timeStr.replace(/\s*\([^)]*\)/, '').trim();
                const [hours, minutes] = cleanTime.split(':').map(Number);
                return hours * 60 + minutes;
            };

            const prayers = [
                { name: 'Fajr', minutes: parsePrayerTime(timings.Fajr) },
                { name: 'Dhuhr', minutes: parsePrayerTime(timings.Dhuhr) },
                { name: 'Asr', minutes: parsePrayerTime(timings.Asr) },
                { name: 'Maghrib', minutes: parsePrayerTime(timings.Maghrib) },
                { name: 'Isha', minutes: parsePrayerTime(timings.Isha) },
            ];

            let next = prayers[0];
            let isNextDay = false;

            for (let i = 0; i < prayers.length; i++) {
                if (currentTimeMinutes < prayers[i].minutes) {
                    next = prayers[i];
                    break;
                }
                if (i === prayers.length - 1) {
                    // It's after Isha, next is Fajr tomorrow
                    next = prayers[0];
                    isNextDay = true;
                }
            }

            // Calculate countdown
            const target = new Date(now);
            const [h, m] = (isNextDay ? timings.Fajr : timings[next.name]).split(':');
            target.setHours(parseInt(h), parseInt(m), 0);
            if (isNextDay) target.setDate(target.getDate() + 1);

            const diff = target.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const countdownStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            setPrayerInfo({
                currentPrayer: next.name,
                countdown: countdownStr,
                currentTime: currentTimeStr
            });
        };

        updateInfo();
        const interval = setInterval(updateInfo, 1000);
        return () => clearInterval(interval);
    }, [timings]);

    return prayerInfo;
};
