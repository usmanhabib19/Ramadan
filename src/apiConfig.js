const API_URL = import.meta.env.VITE_API_URL ||
    (import.meta.env.MODE === 'production' ? '' : 'http://127.0.0.1:5000');

export default API_URL;
