import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ logout }) => {
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [reservationOpen, setReservationOpen] = useState(false);

  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4 flex flex-col space-y-6">
      <div className="flex items-center mb-6">
        <img src="#" alt="Logo" className="w-10 h-10 rounded-full mr-2" />
        <h2 className="text-2xl">Admin Panel</h2>
      </div>
      <ul className="space-y-4">
        <li>
          <Link to="/admin" className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-800">
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <button onClick={() => setEmployeeOpen(!employeeOpen)} className="w-full text-left flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-800">
            <i className="fas fa-users"></i>
            <span>Employee</span>
            <i className={`fas fa-chevron-${employeeOpen ? 'up' : 'down'} ml-auto`}></i>
          </button>
          {employeeOpen && (
            <ul className="ml-6 mt-2 space-y-2">
              <li>
                <Link to="/manage-users" className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-800">
                  <span>Manage Users</span>
                </Link>
              </li>
              <li>
                <Link to="/staff" className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-800">
                  <span>Staff Panel</span>
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <button onClick={() => setReservationOpen(!reservationOpen)} className="w-full text-left flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-800">
            <i className="fas fa-calendar-alt"></i>
            <span>Rooms</span>
            <i className={`fas fa-chevron-${reservationOpen ? 'up' : 'down'} ml-auto`}></i>
          </button>
          {reservationOpen && (
            <ul className="ml-6 mt-2 space-y-2">
              <li>
                <Link to="/reservation" className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-800">
                  <span>Room Reservations</span>
                </Link>
              </li>

            </ul>
          )}
        </li>
        <li>
          <button onClick={logout} className="w-full text-left flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-800">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
