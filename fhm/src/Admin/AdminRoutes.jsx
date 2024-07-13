import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPanel from './AdminPanel';
import RoomReservation from './components/RoomReservation';
import RoomDetails from './components/RoomDetails';
import StaffDetails from './components/StaffDetails';
import Inventory from './components/Inventory';
import AddRoom from './components/AddRoom'; // Import AddRoom
import ProtectedRoute from '../components/ProtectedRoute';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
      <Route path="/room-reservation" element={<ProtectedRoute role="admin"><RoomReservation /></ProtectedRoute>} />
      <Route path="/room-details" element={<ProtectedRoute role="admin"><RoomDetails /></ProtectedRoute>} />
      <Route path="/staff-details" element={<ProtectedRoute role="admin"><StaffDetails /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute role="admin"><Inventory /></ProtectedRoute>} />
      <Route path="/add-room" element={<ProtectedRoute role="admin"><AddRoom /></ProtectedRoute>} /> {/* Add route */}
    </Routes>
  );
};

export default AdminRoutes;
