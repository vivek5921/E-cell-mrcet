import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainPage } from './MainPage';
import { HiddenAdminGate } from './admin/HiddenAdminGate';
import { EurekaPage } from './components/EurekaPage';
import { CustomCursor } from './components/CustomCursor';
import { Toaster } from 'react-hot-toast';
export function App() {
  return (
    <>
      <CustomCursor />
      <Toaster 
        position="top-center" 
        toastOptions={{ 
          style: { 
            background: 'var(--bg-glass-card)', 
            color: '#fff', 
            border: '1px solid var(--border-color)',
            backdropFilter: 'blur(10px)'
          } 
        }} 
      />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/eureka" element={<EurekaPage />} />
      </Routes>
      <HiddenAdminGate />
    </>
  );
}

export default App;
