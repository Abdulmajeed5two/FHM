import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import UserTable from './components/UserTable';

const StaffPanel = () => {
  const [user, setUser] = useState({ name: '', role: '' });
  const [showReservationForm, setShowReservationForm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const userInfo = JSON.parse(atob(token.split('.')[1]));
        try {
          const response = await axios.get(`http://localhost:5200/users/${userInfo.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser({ name: response.data.name, role: response.data.role });
        } catch (err) {
          console.error('Error fetching user:', err);
        }
      }
    };

    fetchUser();
  }, []);

  const handleMenuClick = (menu) => {
    if (menu === 'reservation') {
      setShowReservationForm(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex">
      <Sidebar onMenuClick={handleMenuClick} logout={logout} />
      <div className="flex-1">
        <Topbar user={user} />
        <UserTable showReservationForm={showReservationForm} handleReservationSubmit={handleReservationSubmit} />
      </div>
    </div>
  );
};

export default StaffPanel;
