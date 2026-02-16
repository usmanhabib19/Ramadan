/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#d4af37',
                    light: '#f1d279',
                    dark: '#8c6d1f',
                }
            }
        },
    },
    plugins: [],
}
