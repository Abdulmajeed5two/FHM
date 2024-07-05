import React from 'react';

const Sidebar = ({ onMenuClick, logout }) => {
  return (
    <div className="bg-gray-800 text-white h-screen w-1/5 flex flex-col">
     
      <button className="py-2 px-4 mt-4 mx-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        onClick={() => onMenuClick('reservation')}>
        Make Reservation
      </button>
      <button className="py-2 px-4 mt-4 mx-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
