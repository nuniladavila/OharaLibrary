
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import AdminPanel from './AdminPanel';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin-panel" element={<AdminPanel />} />
    </Routes>
  );
}

export default App;
