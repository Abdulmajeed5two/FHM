import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import TotalAmountCard from './components/TotalAmountCard';
import TotalRoomsCard from './components/TotalRoomsCard';
import ReservedRoomsCard from './components/ReservedRoomsCard';
import AvailableRoomsCard from './components/AvailableRoomsCard';
import RoomDetails from './components/RoomDetails';
import StaffDetails from './components/StaffDetails';
import Inventory from './components/Inventory';
import AddRoom from './components/AddRoom';
import RoomReservation from './components/RoomReservation';
import CleaningForm from './components/CleaningForm';
import ReservedRooms from './components/ReservedRooms'; 
import Reports from './components/Reports';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPanel = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const renderActiveComponent = () => {
    const componentStyle = "mt-4";

    switch (activeComponent) {
      case 'dashboard':
        return (
          <div className={componentStyle}>
            <h2 className="text-2xl mb-12">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <TotalAmountCard />
              <TotalRoomsCard />
              <ReservedRoomsCard />
              <AvailableRoomsCard />
            </div>
            <ReservedRooms /> 
          </div>
        );
      case 'roomReservation':
        return <div className={componentStyle}><RoomReservation /></div>;
      case 'roomDetails':
        return <div className={componentStyle}><RoomDetails /></div>;
      case 'staffDetails':
        return <div className={componentStyle}><StaffDetails /></div>;
      case 'inventory':
        return <div className={componentStyle}><Inventory /></div>;
      case 'addRoom':
        return <div className={componentStyle}><AddRoom /></div>;
      case 'cleaningForm':
        return <div className={componentStyle}><CleaningForm /></div>;
      case 'reports':
        return <div className={componentStyle}><Reports /></div>; 
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

export default AdminPanel;
