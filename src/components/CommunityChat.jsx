import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Users, Loader2 } from 'lucide-react';

const CommunityChat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [name, setName] = useState(() => localStorage.getItem('chat-name') || '');
    const [isJoining, setIsJoining] = useState(!localStorage.getItem('chat-name'));
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(fetchMessages, 3000);
        fetchMessages();
        return () => clearInterval(interval);
    }, []);

    const handleJoin = () => {
        if (name.trim()) {
            localStorage.setItem('chat-name', name.trim());
            setIsJoining(false);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await fetch('http://127.0.0.1:5000/api/community/messages');
            const data = await res.json();
            if (Array.isArray(data)) setMessages(data);
        } catch (err) {
            console.error('Failed to fetch messages');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !name.trim()) return;

        setIsLoading(true);
        try {
            await fetch('http://127.0.0.1:5000/api/community/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, text: newMessage }),
            });
            setNewMessage('');
            fetchMessages();
        } catch (err) {
            console.error('Failed to send message');
        } finally {
            setIsLoading(false);
        }
    };

    if (isJoining) {
        return (
            <div className="glass-card p-12 text-center max-w-lg mx-auto">
                <div className="w-16 h-16 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-[#d4af37]" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Enter the <span className="text-[#d4af37]">Majlis</span></h3>
                <p className="text-slate-400 mb-8">Choose a name to start talking with the community.</p>
                <div className="space-y-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name (e.g. Ahmed)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-[#d4af37]/50 text-white"
                    />
                    <button
                        onClick={handleJoin}
                        className="btn-primary w-full py-4 font-bold"
                        disabled={!name.trim()}
                    >
                        Join Discussion
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-card flex flex-col h-[600px] overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#d4af37]/10 rounded-xl flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-[#d4af37]" />
                        </div>
                        <div>
                            <h3 className="font-bold">Community Majlis</h3>
                            <p className="text-xs text-green-500 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live Discussion
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
                >
                    {messages.map((msg, idx) => (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={idx}
                            className={`flex flex-col ${msg.name === name ? 'items-end' : 'items-start'}`}
                        >
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 px-1">{msg.name}</span>
                            <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${msg.name === name
                                ? 'bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] rounded-tr-none'
                                : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-6 border-t border-white/5 bg-white/[0.02]">
                    <div className="relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Share a reflection or greeting..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-6 pr-14 focus:outline-none focus:border-[#d4af37]/50 text-white text-sm"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !newMessage.trim()}
                            className="absolute right-2 top-2 bottom-2 px-3 bg-[#d4af37] text-[#050a14] rounded-lg hover:scale-105 transition-all disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </div>
                </form>
            </div>

            <div className="glass-card p-8 flex flex-col justify-center text-center space-y-6">
                <div className="w-16 h-16 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-[#d4af37]" />
                </div>
                <h3 className="text-xl font-bold">Why Join?</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                    Our community is a safe space for spiritual growth, sharing Iftar moments, and supporting each other through the blessed month.
                </p>
                <div className="pt-4 border-t border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">Guidelines</p>
                    <ul className="text-xs text-slate-400 space-y-3 text-left">
                        <li className="flex items-start gap-2">
                            <span className="text-[#d4af37]">•</span> Be respectful and kind to all members.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#d4af37]">•</span> Share authentic Islamic knowledge.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#d4af37]">•</span> Avoid political or controversial debates.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CommunityChat;
