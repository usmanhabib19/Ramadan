import { useState, useEffect } from 'react';

export const useRamadanCalendar = (city = 'London', country = 'UK', month, year) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const queryParams = new URLSearchParams({
                    city,
                    country,
                    method: '2',
                    ...(month && { month }),
                    ...(year && { year })
                });

                const response = await fetch(
                    `https://api.aladhan.com/v1/calendarByCity?${queryParams}`
                );
                const result = await response.json();

                if (result.code === 200) {
                    setData(result.data);
                } else {
                    setError('Failed to fetch calendar');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCalendar();
    }, [city, country, month, year]);

    return { data, loading, error };
};
