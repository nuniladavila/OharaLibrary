
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import AddBook from './AddBook';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin-panel" element={<AddBook />} />
    </Routes>
  );
}

export default App;
