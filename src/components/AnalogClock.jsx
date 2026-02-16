import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnalogClock = ({ size = 200 }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    // Calculate rotation angles
    const secondAngle = (seconds * 6) - 90; // 6 degrees per second
    const minuteAngle = (minutes * 6 + seconds * 0.1) - 90; // 6 degrees per minute
    const hourAngle = (hours * 30 + minutes * 0.5) - 90; // 30 degrees per hour

    const radius = size / 2;
    const centerX = radius;
    const centerY = radius;

    // Generate hour markers
    const hourMarkers = Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const markerLength = 12;
        const startRadius = radius - 25;
        const endRadius = radius - 25 + markerLength;

        return {
            x1: centerX + Math.cos(angle) * startRadius,
            y1: centerY + Math.sin(angle) * startRadius,
            x2: centerX + Math.cos(angle) * endRadius,
            y2: centerY + Math.sin(angle) * endRadius,
        };
    });

    // Generate minute markers
    const minuteMarkers = Array.from({ length: 60 }, (_, i) => {
        if (i % 5 === 0) return null; // Skip hour positions
        const angle = (i * 6 - 90) * (Math.PI / 180);
        const markerLength = 6;
        const startRadius = radius - 25;
        const endRadius = radius - 25 + markerLength;

        return {
            x1: centerX + Math.cos(angle) * startRadius,
            y1: centerY + Math.sin(angle) * startRadius,
            x2: centerX + Math.cos(angle) * endRadius,
            y2: centerY + Math.sin(angle) * endRadius,
        };
    }).filter(Boolean);

    return (
        <div className="relative inline-block">
            <svg width={size} height={size} className="drop-shadow-2xl">
                {/* Outer glow */}
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1a1a2e" />
                        <stop offset="100%" stopColor="#0a0a14" />
                    </linearGradient>
                    <radialGradient id="centerGlow">
                        <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Clock face background */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={radius - 10}
                    fill="url(#clockGradient)"
                    stroke="#d4af37"
                    strokeWidth="2"
                    opacity="0.9"
                />

                {/* Inner decorative circle */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={radius - 20}
                    fill="none"
                    stroke="#d4af37"
                    strokeWidth="1"
                    opacity="0.3"
                />

                {/* Center glow effect */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={radius - 30}
                    fill="url(#centerGlow)"
                    opacity="0.2"
                />

                {/* Hour markers */}
                {hourMarkers.map((marker, i) => (
                    <line
                        key={`hour-${i}`}
                        x1={marker.x1}
                        y1={marker.y1}
                        x2={marker.x2}
                        y2={marker.y2}
                        stroke="#d4af37"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                ))}

                {/* Minute markers */}
                {minuteMarkers.map((marker, i) => (
                    <line
                        key={`minute-${i}`}
                        x1={marker.x1}
                        y1={marker.y1}
                        x2={marker.x2}
                        y2={marker.y2}
                        stroke="#d4af37"
                        strokeWidth="1"
                        strokeLinecap="round"
                        opacity="0.5"
                    />
                ))}

                {/* Hour hand */}
                <motion.line
                    x1={centerX}
                    y1={centerY}
                    x2={centerX + Math.cos(hourAngle * Math.PI / 180) * (radius - 60)}
                    y2={centerY + Math.sin(hourAngle * Math.PI / 180) * (radius - 60)}
                    stroke="#d4af37"
                    strokeWidth="6"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    initial={false}
                    animate={{
                        x2: centerX + Math.cos(hourAngle * Math.PI / 180) * (radius - 60),
                        y2: centerY + Math.sin(hourAngle * Math.PI / 180) * (radius - 60)
                    }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                />

                {/* Minute hand */}
                <motion.line
                    x1={centerX}
                    y1={centerY}
                    x2={centerX + Math.cos(minuteAngle * Math.PI / 180) * (radius - 40)}
                    y2={centerY + Math.sin(minuteAngle * Math.PI / 180) * (radius - 40)}
                    stroke="#f8f9fa"
                    strokeWidth="4"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    initial={false}
                    animate={{
                        x2: centerX + Math.cos(minuteAngle * Math.PI / 180) * (radius - 40),
                        y2: centerY + Math.sin(minuteAngle * Math.PI / 180) * (radius - 40)
                    }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                />

                {/* Second hand */}
                <motion.line
                    x1={centerX}
                    y1={centerY}
                    x2={centerX + Math.cos(secondAngle * Math.PI / 180) * (radius - 30)}
                    y2={centerY + Math.sin(secondAngle * Math.PI / 180) * (radius - 30)}
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={false}
                    animate={{
                        x2: centerX + Math.cos(secondAngle * Math.PI / 180) * (radius - 30),
                        y2: centerY + Math.sin(secondAngle * Math.PI / 180) * (radius - 30)
                    }}
                    transition={{ type: "spring", stiffness: 80, damping: 15 }}
                />

                {/* Center dot */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r="8"
                    fill="#d4af37"
                    stroke="#1a1a2e"
                    strokeWidth="2"
                />
                <circle
                    cx={centerX}
                    cy={centerY}
                    r="4"
                    fill="#1a1a2e"
                />
            </svg>

            {/* Digital time display below clock */}
            <div className="text-center mt-4">
                <div className="text-2xl font-bold text-[#d4af37] font-mono">
                    {time.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    })}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">
                    Pakistan Time
                </div>
            </div>
        </div>
    );
};

export default AnalogClock;
