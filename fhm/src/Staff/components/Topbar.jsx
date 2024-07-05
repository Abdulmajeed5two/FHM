import React from 'react';

const Topbar = ({ user }) => {
  return (
    <div className="bg-gray-200 p-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Staff Panel</h1>
      <div>
        {user.name ? (
          <span className="mr-2">Welcome, {user.name}</span>
        ) : (
          <span className="mr-2">Welcome</span>
        )}
        <span className="bg-gray-700 px-2 py-1 rounded text-white text-sm">{user.role}</span>
      </div>
    </div>
  );
};

export default Topbar;
