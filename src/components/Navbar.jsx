import { useState, useEffect } from 'react';
import { Moon, Menu, X, Bell, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onJoinCommunity, onOpenProfile, isJoined }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'Prayer Times', href: '#prayer-times' },
        { name: 'Calendar', href: '#calendar' },
        { name: 'Community', href: '#community' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4 bg-[#050a14]/80 backdrop-blur-md border-b border-white/5' : 'py-6 bg-transparent'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Moon className="text-[#d4af37] fill-[#d4af37]" />
                    <span className="text-xl font-bold tracking-tight text-white uppercase letter-spacing-widest">
                        Ramadan <span className="text-[#d4af37]">Kareem</span>
                    </span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-slate-300 hover:text-[#d4af37] transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                    {isJoined ? (
                        <div
                            className="flex items-center gap-4 border-l border-white/10 pl-8 cursor-pointer group"
                            onClick={onOpenProfile}
                        >
                            <div className="w-10 h-10 bg-[#d4af37]/10 rounded-full flex items-center justify-center border border-[#d4af37]/30 group-hover:bg-[#d4af37]/20 transition-all">
                                <User className="w-5 h-5 text-[#d4af37]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">Member</span>
                                <span className="text-xs font-bold text-[#d4af37]">Manage Profile</span>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={onJoinCommunity}
                            className="bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] px-5 py-2 rounded-full text-sm font-medium hover:bg-[#d4af37] hover:text-[#050a14] transition-all"
                        >
                            Join Community
                        </button>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-[#0a1324] border-b border-white/5 py-8 px-6 flex flex-col gap-6 md:hidden"
                    >
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-lg font-medium text-slate-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        {!isJoined && (
                            <button
                                className="btn-primary w-full"
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    onJoinCommunity();
                                }}
                            >
                                Join Community
                            </button>
                        )}
                        {isJoined && (
                            <div
                                className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 cursor-pointer"
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    onOpenProfile();
                                }}
                            >
                                <div className="w-10 h-10 bg-[#d4af37]/10 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-[#d4af37]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white tracking-widest uppercase">Member Account</span>
                                    <span className="text-[10px] text-[#d4af37] font-bold uppercase">Edit Profile</span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
