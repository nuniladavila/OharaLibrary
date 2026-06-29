
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPanel from './Admin/AdminPanel';
import HomePageAlt from './HomePageAlt';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePageAlt />} />
      <Route path="/admin-panel/*" element={<AdminPanel />} />
    </Routes>
  );
}

export default App;
