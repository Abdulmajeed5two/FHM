import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Auth/Login';
import Register from './Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPanel from './Admin/AdminPanel';
import StaffPanel from './Staff/StaffPanel';
import Reservation from './Admin/components/Reservation';
import WaitingList from './components/WaitingList';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
        <Route path="/staff" element={<StaffPanel />} />
        <Route path='/reservation' element={<Reservation />} />
        <Route path='/waitinglist' element={<WaitingList />} />
      </Routes>
    </Router>
  );
};

export default App;
