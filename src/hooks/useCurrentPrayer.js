import { useState, useEffect } from 'react';

/**
 * Custom hook to determine the current/next prayer based on real-time
 * @param {Object} timings - Prayer timings object from Aladhan API
 * @returns {string} - Name of the current/next prayer
 */
export const useCurrentPrayer = (timings) => {
    const [currentPrayer, setCurrentPrayer] = useState('Fajr');

    useEffect(() => {
        if (!timings) return;

        const updateCurrentPrayer = () => {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();

            // Parse prayer times (format: "HH:MM (TZ)")
            const parsePrayerTime = (timeStr) => {
                if (!timeStr) return 0;
                const cleanTime = timeStr.replace(/\s*\([^)]*\)/, '').trim();
                const [hours, minutes] = cleanTime.split(':').map(Number);
                return hours * 60 + minutes;
            };

            const prayerTimes = {
                Fajr: parsePrayerTime(timings.Fajr),
                Dhuhr: parsePrayerTime(timings.Dhuhr),
                Asr: parsePrayerTime(timings.Asr),
                Maghrib: parsePrayerTime(timings.Maghrib),
                Isha: parsePrayerTime(timings.Isha),
            };

            // Determine which prayer is current/next
            if (currentTime < prayerTimes.Fajr) {
                setCurrentPrayer('Fajr');
            } else if (currentTime < prayerTimes.Dhuhr) {
                setCurrentPrayer('Dhuhr');
            } else if (currentTime < prayerTimes.Asr) {
                setCurrentPrayer('Asr');
            } else if (currentTime < prayerTimes.Maghrib) {
                setCurrentPrayer('Maghrib');
            } else if (currentTime < prayerTimes.Isha) {
                setCurrentPrayer('Isha');
            } else {
                // After Isha, next prayer is Fajr
                setCurrentPrayer('Fajr');
            }
        };

        updateCurrentPrayer();

        // Update every minute
        const interval = setInterval(updateCurrentPrayer, 60000);

        return () => clearInterval(interval);
    }, [timings]);

    return currentPrayer;
};
