import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPanel from './AdminPanel';
import RoomReservation from './components/RoomReservation';
import RoomDetails from './components/RoomDetails';
import StaffDetails from './components/StaffDetails';
import Inventory from './components/Inventory';
import AddRoom from './components/AddRoom'; 
import ProtectedRoute from '../components/ProtectedRoute';
import CleaningForm from './components/CleaningForm';
import Reports from './components/Reports';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
      <Route path="/room-reservation" element={<ProtectedRoute role="admin"><RoomReservation /></ProtectedRoute>} />
      <Route path="/room-details" element={<ProtectedRoute role="admin"><RoomDetails /></ProtectedRoute>} />
      <Route path="/staff-details" element={<ProtectedRoute role="admin"><StaffDetails /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute role="admin"><Inventory /></ProtectedRoute>} />
      <Route path="/add-room" element={<ProtectedRoute role="admin"><AddRoom /></ProtectedRoute>} />
      <Route path="/cleaning-form" element={<ProtectedRoute role="admin"><CleaningForm /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute role="admin"><Reports /></ProtectedRoute>} />
    </Routes>
  );
};

export default AdminRoutes;
