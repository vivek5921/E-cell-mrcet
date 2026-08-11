import React, { useState, useEffect } from 'react';
import { API_URL } from './config.js';
import axios from 'axios';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { VisionMission } from './components/VisionMission';
import { WhyJoin } from './components/WhyJoin';
import { Activities } from './components/Activities';
import { Team } from './components/Team';
import { Gallery } from './components/Gallery';
import { JoinCommunity } from './components/JoinCommunity';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { JoinModal } from './components/JoinModal';

export const MainPage = () => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [settings, setSettings] = useState(null);

  const handleOpenJoinModal = () => setIsJoinModalOpen(true);
  const handleCloseJoinModal = () => setIsJoinModalOpen(false);

  useEffect(() => {
    axios.get(`${API_URL}/api/public/settings`)
      .then(res => {
        if (res.data) setSettings(res.data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="app-root">
      <Navbar onOpenJoinModal={handleOpenJoinModal} settings={settings} />
      <main>
        <Hero onOpenJoinModal={handleOpenJoinModal} />
        <About />
        <VisionMission />
        <WhyJoin />
        <Activities />
        <Team />
        <Gallery />
        <JoinCommunity onOpenJoinModal={handleOpenJoinModal} />
        <Contact />
      </main>
      <Footer settings={settings} />
      <JoinModal isOpen={isJoinModalOpen} onClose={handleCloseJoinModal} />
    </div>
  );
};

