import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainPage } from './MainPage';
import { HiddenAdminGate } from './admin/HiddenAdminGate';
import { EurekaPage } from './components/EurekaPage';

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/eureka" element={<EurekaPage />} />
      </Routes>
      <HiddenAdminGate />
    </>
  );
}

export default App;
