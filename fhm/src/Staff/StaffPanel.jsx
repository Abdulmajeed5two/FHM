import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import RoomDetails from '../Admin/components/RoomDetails';
import Inventory from '../Admin/components/Inventory';
import RoomReservation from '../Admin/components/RoomReservation';
import AddRoom from '../Admin/components/AddRoom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardCard from '../Admin/components/DashboardCard';

const StaffPanel = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({
    totalAmount: 0,
    reservedRooms: 0,
    availableRooms: 0,
    totalRooms: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('http://localhost:5200/dashboard');
        setDashboardData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  const renderActiveComponent = () => {
    const componentStyle = "mt-4";

    switch (activeComponent) {
      case 'dashboard':
        return (
          <div className={componentStyle}>
            <h2 className="text-2xl mb-12">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <DashboardCard title="Total Amount" value={`$${dashboardData.totalAmount}`} />
              <DashboardCard title="Total Rooms" value={dashboardData.totalRooms} />
              <DashboardCard title="Reserved Rooms" value={dashboardData.reservedRooms} />
              <DashboardCard title="Available Rooms" value={dashboardData.availableRooms} />
            </div>
          </div>
        );
      case 'roomReservation':
        return <div className={componentStyle}><RoomReservation /></div>;
      case 'roomDetails':
        return <div className={componentStyle}><RoomDetails /></div>;
      case 'inventory':
        return <div className={componentStyle}><Inventory /></div>;
      case 'addRoom':
        return <div className={componentStyle}><AddRoom /></div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="flex-1 p-4 ml-64">
          <ToastContainer />
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
};

export default StaffPanel;
