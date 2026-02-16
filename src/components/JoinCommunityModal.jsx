import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

const JoinCommunityModal = ({ isOpen, onClose, onSuccess }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '' });

    const [mode, setMode] = useState('join'); // 'join' or 'login'

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const endpoint = mode === 'join' ? '/api/members' : '/api/members/login';

        try {
            const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('community-joined', 'true');
                localStorage.setItem('chat-name', data.name || formData.name);
                setIsSubmitted(true);
                if (onSuccess) onSuccess(formData.email);
            } else {
                setError(data.error || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Connection failed. Please ensure the server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '' });
        setMode('join');
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#050a14]/90 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg glass-card p-8 md:p-12 overflow-hidden"
                >
                    {/* Background Ornament Decoration */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#d4af37]/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#1e3a8a]/10 rounded-full blur-3xl" />

                    <button
                        onClick={handleClose}
                        className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <div className="text-center mb-10">
                                    <div className="w-16 h-16 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <ShieldCheck className="w-8 h-8 text-[#d4af37]" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4">
                                        {mode === 'join' ? 'Join Our ' : 'Welcome Back to '}
                                        <span className="text-[#d4af37]">Community</span>
                                    </h2>
                                    <p className="text-slate-400">
                                        {mode === 'join'
                                            ? 'Be part of something meaningful this Ramadan. Connect, share, and grow with the Ummah.'
                                            : 'Enter your email to restore your status and join the discussion.'}
                                    </p>
                                </div>

                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    {mode === 'join' && (
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-1 py-1 flex items-center pointer-events-none">
                                                <span className="text-sm px-4 text-slate-500 border-r border-white/10 flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                </span>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                required={mode === 'join'}
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-16 pr-4 focus:outline-none focus:border-[#d4af37]/50 text-white placeholder-slate-500 transition-all font-medium"
                                            />
                                        </div>
                                    )}

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-1 py-1 flex items-center pointer-events-none">
                                            <span className="text-sm px-4 text-slate-500 border-r border-white/10 flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                            </span>
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-16 pr-4 focus:outline-none focus:border-[#d4af37]/50 text-white placeholder-slate-500 transition-all font-medium"
                                        />
                                    </div>

                                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="btn-primary w-full py-5 text-lg font-bold shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            mode === 'join' ? 'Become a Member' : 'Login'
                                        )}
                                    </button>

                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={() => setMode(mode === 'join' ? 'login' : 'join')}
                                            className="text-sm text-[#d4af37] hover:underline transition-all"
                                        >
                                            {mode === 'join' ? 'Already a member? Login here' : 'New here? Join the community'}
                                        </button>
                                    </div>

                                    <p className="text-center text-xs text-slate-500 tracking-wide uppercase">
                                        {mode === 'join' ? 'By joining, you agree to our spiritual community guidelines.' : 'Welcome back to your spiritual journey.'}
                                    </p>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Successfully <span className="text-[#d4af37]">Joined!</span></h2>
                                <p className="text-slate-300 mb-10">Welcome to the community, {formData.name.split(' ')[0]}! You are now part of our spiritual journey this Ramadan.</p>
                                <button
                                    onClick={handleClose}
                                    className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition-all"
                                >
                                    Continue Exploring
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default JoinCommunityModal;
