import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, MapPin, AlignLeft, Camera, Save, LogOut, CheckCircle2, Loader2 } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose, userEmail, onUpdate, onLogout }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        bio: '',
        location: ''
    });

    useEffect(() => {
        if (isOpen && userEmail) {
            fetchProfile();
        }
    }, [isOpen, userEmail]);

    const fetchProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/members/${userEmail}`);
            if (res.ok) {
                const data = await res.json();
                setProfileData({
                    name: data.name || '',
                    email: data.email || '',
                    bio: data.bio || '',
                    location: data.location || ''
                });
            } else {
                setError('Failed to load profile details.');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const res = await fetch('http://127.0.0.1:5000/api/members', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });

            if (res.ok) {
                const updatedData = await res.json();
                setSuccess(true);
                setIsEditing(false);
                if (onUpdate) onUpdate(updatedData);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to update profile.');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#050a14]/95 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl glass-card overflow-hidden flex flex-col max-h-[95vh] md:max-h-none"
                >
                    {/* Close Button - Moved here for better mobile clickability */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-[120] text-white/50 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header Decoration */}
                    <div className="h-32 bg-gradient-to-r from-[#d4af37]/20 via-[#1e3a8a]/20 to-[#d4af37]/20 relative">
                        <div className="absolute inset-0 bg- islamic-pattern opacity-10" />
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-10 -mt-20 md:-mt-16 relative custom-scrollbar">
                        {/* Profile Header */}
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-10 text-center md:text-left">
                            <div className="relative group">
                                <div className="w-28 h-28 md:w-32 md:h-32 bg-[#0a1324] border-4 border-[#050a14] rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                                    <User className="w-14 h-14 md:w-16 md:h-16 text-[#d4af37]" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-4 h-4 md:w-5 md:h-5 bg-green-500 border-4 border-[#1e3a8a] rounded-full" />
                            </div>

                            <div className="flex-1">
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{profileData.name}</h2>
                                <p className="text-[#d4af37] font-medium text-[10px] md:text-sm tracking-widest uppercase flex items-center justify-center md:justify-start gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Community Member
                                </p>
                            </div>

                            <div className="flex gap-3 mt-4 md:mt-0">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Profile Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <ProfileItem
                                    icon={<User />}
                                    label="Full Name"
                                    value={profileData.name}
                                    isEditing={isEditing}
                                    name="name"
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                />
                                <ProfileItem
                                    icon={<Mail />}
                                    label="Email Address"
                                    value={profileData.email}
                                    isEditing={isEditing}
                                    name="email"
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                />
                                <ProfileItem
                                    icon={<MapPin />}
                                    label="Location"
                                    value={profileData.location}
                                    placeholder="Enter your city/country"
                                    isEditing={isEditing}
                                    name="location"
                                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                />
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <AlignLeft className="w-3 h-3" /> Spiritual Bio
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                            placeholder="Tell us about your Ramadan journey..."
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-[#d4af37]/50 transition-all min-h-[120px] resize-none"
                                        />
                                    ) : (
                                        <p className="text-slate-400 text-sm leading-relaxed p-4 bg-white/2 rounded-2xl min-h-[120px]">
                                            {profileData.bio || "No bio added yet. Tell the community a bit about yourself!"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Error/Success Messages */}
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                                    {error}
                                </motion.div>
                            )}
                            {success && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm text-center flex items-center justify-center gap-2 font-bold">
                                    <CheckCircle2 className="w-4 h-4" /> Profile Updated Successfully!
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Footer Actions */}
                        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center">
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 text-slate-500 hover:text-red-400 text-sm font-bold uppercase tracking-widest transition-all"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out from Ummah
                            </button>

                            {isEditing && (
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="btn-primary flex items-center gap-2 px-10 py-3 rounded-xl disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div >
        </AnimatePresence >
    );
};

const ProfileItem = ({ icon, label, value, isEditing, name, onChange, placeholder }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            {React.cloneElement(icon, { className: 'w-3 h-3' })} {label}
        </label>
        {isEditing ? (
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#d4af37]/50 transition-all"
            />
        ) : (
            <div className="text-white font-medium text-sm py-1">
                {value || <span className="text-slate-600 italic">Not specified</span>}
            </div>
        )}
    </div>
);

export default ProfileModal;
