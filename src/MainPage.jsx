import React, { useState } from 'react';
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

  const handleOpenJoinModal = () => setIsJoinModalOpen(true);
  const handleCloseJoinModal = () => setIsJoinModalOpen(false);

  return (
    <div className="app-root">
      <Navbar onOpenJoinModal={handleOpenJoinModal} />
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
      <Footer />
      <JoinModal isOpen={isJoinModalOpen} onClose={handleCloseJoinModal} />
    </div>
  );
};
