import { useState, useEffect } from 'react';

export const usePrayerTimes = (city = 'London', country = 'UK') => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTimes = async () => {
            try {
                const response = await fetch(
                    `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`
                );
                const result = await response.json();

                if (result.code === 200) {
                    setData(result.data);
                } else {
                    setError('Failed to fetch prayer times');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTimes();
    }, [city, country]);

    return { data, loading, error };
};
