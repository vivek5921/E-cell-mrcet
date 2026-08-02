import React from 'react';
import { MainPage } from './MainPage';
import { HiddenAdminGate } from './admin/HiddenAdminGate';

export function App() {
  return (
    <>
      <MainPage />
      <HiddenAdminGate />
    </>
  );
}

export default App;
