import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PrayerTimes from './components/PrayerTimes';
import Calendar from './components/Calendar';
import RamadanToolbox from './components/RamadanToolbox';
import { motion } from 'framer-motion';
import { Heart, Users, ShieldCheck } from 'lucide-react';
import JoinCommunityModal from './components/JoinCommunityModal';
import CommunityChat from './components/CommunityChat';
import ProfileModal from './components/ProfileModal';
import { useState, useEffect } from 'react';
import API_URL from './apiConfig';

function App() {
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [isJoined, setIsJoined] = useState(() => localStorage.getItem('community-joined') === 'true');
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('user-email') || '');
  const [liveCount, setLiveCount] = useState(1);

  const fetchOnlineCount = async () => {
    try {
      const res = await fetch(`${API_URL}/api/online/count`);
      const data = await res.json();
      if (data.count !== undefined) setLiveCount(data.count);
    } catch (err) {
      console.error('Failed to fetch online count');
    }
  };

  const sendHeartbeat = async () => {
    try {
      await fetch(`${API_URL}/api/online/heartbeat`, { method: 'POST' });
    } catch (err) {
      console.error('Heartbeat failed');
    }
  };

  const handleJoinSuccess = (email) => {
    fetchMemberCount();
    setIsJoined(true);
    if (email) {
      setUserEmail(email);
      localStorage.setItem('user-email', email);
    }
  };

  const handleProfileUpdate = (updatedData) => {
    if (updatedData.name) {
      localStorage.setItem('chat-name', updatedData.name);
    }
    if (updatedData.email) {
      setUserEmail(updatedData.email);
      localStorage.setItem('user-email', updatedData.email);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('community-joined');
    localStorage.removeItem('user-email');
    localStorage.removeItem('chat-name');
    setIsJoined(false);
    setUserEmail('');
    setIsProfileModalOpen(false);
    window.location.reload();
  };

  const fetchMemberCount = async () => {
    try {
      const res = await fetch(`${API_URL}/api/members/count`);
      const data = await res.json();
      if (data.count !== undefined) setMemberCount(data.count);
    } catch (err) {
      console.error('Failed to fetch member count');
    }
  };

  useEffect(() => {
    fetchMemberCount();
    fetchOnlineCount();
    sendHeartbeat();

    const countInterval = setInterval(fetchOnlineCount, 60000); // Update count every minute
    const heartbeatInterval = setInterval(sendHeartbeat, 30000); // Heartbeat every 30s

    return () => {
      clearInterval(countInterval);
      clearInterval(heartbeatInterval);
    };
  }, []);

  const features = [
    { title: 'Spirituality', desc: 'Deepen your connection with Allah through guided resources.', icon: <Heart className="text-[#d4af37]" /> },
    { title: 'Community', desc: 'Find local events and Iftar gatherings near you.', icon: <Users className="text-[#d4af37]" /> },
    { title: 'Charity', desc: 'The month of giving. Support those in need efficiently.', icon: <ShieldCheck className="text-[#d4af37]" /> },
  ];

  return (
    <main className="relative bg-[#050a14] text-white selection:bg-[#d4af37]/30">
      <Navbar
        onJoinCommunity={() => setIsCommunityModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        isJoined={isJoined}
      />
      <Hero memberCount={memberCount} liveCount={liveCount} isJoined={isJoined} />

      {/* Features Section */}
      <section id="community" className="py-24 bg-[#0a1324]/50 islamic-pattern relative overflow-hidden">
        <div className="container px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-10 hover:border-[#d4af37]/30 transition-all cursor-pointer group"
                onClick={() => setIsCommunityModalOpen(true)}
              >
                <div className="w-12 h-12 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#d4af37]/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  {feature.desc}
                </p>
                {!isJoined && (
                  <div className="flex items-center gap-2 text-[#d4af37] text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Join Now <span>→</span>
                  </div>
                )}
                {isJoined && (
                  <div className="flex items-center gap-2 text-green-500 text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Member <span>✓</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            id="community-majlis"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="mt-12"
          >
            <CommunityChat />
          </motion.div>
        </div>
      </section>

      <RamadanToolbox />
      <PrayerTimes />
      <Calendar />
      <JoinCommunityModal
        isOpen={isCommunityModalOpen}
        onClose={() => setIsCommunityModalOpen(false)}
        onSuccess={handleJoinSuccess}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userEmail={userEmail}
        onUpdate={handleProfileUpdate}
        onLogout={handleLogout}
      />

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-[#050a14]">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center md:items-start gap-4">
              <span className="text-2xl font-bold tracking-tight text-white uppercase">
                Ramadan <span className="text-[#d4af37]">Kareem</span>
              </span>
              <p className="text-slate-500 max-w-xs text-center md:text-left">
                Empowering the Ummah with modern tools for a more meaningful Ramadan journey.
              </p>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/5 text-center text-slate-600 text-xs tracking-widest uppercase">
            © 2026 Ramadan Kareem. All spiritual rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}

export default App;
