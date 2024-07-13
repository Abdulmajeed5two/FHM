import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StaffPanel from './StaffPanel';

const StaffRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StaffPanel />} />
    </Routes>
  );
};

export default StaffRoutes;
