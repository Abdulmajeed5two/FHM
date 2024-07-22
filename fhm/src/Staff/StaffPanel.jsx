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

const StaffPanel = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');


  const renderActiveComponent = () => {
    const componentStyle = "mt-4";

    switch (activeComponent) {
      case 'dashboard':
        return (
          <div className={componentStyle}>
            <h2 className="text-2xl mb-12">Dashboard</h2>
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
