import { motion } from 'framer-motion';

export const Lantern = ({ className = "", delay = 0 }) => (
    <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
            duration: 2,
            delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
        }}
        className={`relative ${className}`}
    >
        <svg width="60" height="120" viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Hanging Chain */}
            <line x1="30" y1="0" x2="30" y2="20" stroke="#d4af37" strokeWidth="2" strokeDasharray="2 2" />

            {/* Top Cap */}
            <path d="M15 25 C15 20, 45 20, 45 25 L50 35 L10 35 Z" fill="#d4af37" />

            {/* Body */}
            <path d="M10 35 L50 35 L55 75 L30 95 L5 75 Z" fill="#d4af37" fillOpacity="0.2" stroke="#d4af37" strokeWidth="2" />

            {/* Glass/Light Glow */}
            <path d="M15 40 L45 40 L50 70 L30 85 L10 70 Z" fill="url(#lantern-glow)" />

            {/* Internal Patterns */}
            <path d="M30 40 V85 M15 50 H45 M15 65 H45" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.5" />

            {/* Bottom Tip */}
            <path d="M25 95 L30 105 L35 95 Z" fill="#d4af37" />

            <defs>
                <radialGradient id="lantern-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(30 65) rotate(90) scale(35 25)">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                </radialGradient>
            </defs>
        </svg>
        {/* Flicker Effect */}
        <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 0.2, repeat: Infinity }}
            className="absolute top-[50px] left-[25px] w-2 h-2 bg-[#d4af37] blur-sm rounded-full"
        />
    </motion.div>
);

export const Ornament = ({ className = "" }) => (
    <div className={`opacity-10 pointer-events-none select-none ${className}`}>
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="150" stroke="#d4af37" strokeWidth="1" strokeDasharray="10 10" />
            <path d="M200 50 L250 150 L350 200 L250 250 L200 350 L150 250 L50 200 L150 150 Z" stroke="#d4af37" strokeWidth="2" />
            <rect x="100" y="100" width="200" height="200" transform="rotate(45 200 200)" stroke="#d4af37" strokeWidth="1" />
        </svg>
    </div>
);
