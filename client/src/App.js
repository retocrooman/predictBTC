import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Admin from './components/Admin';

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Admin />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
