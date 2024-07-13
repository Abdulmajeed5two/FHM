import React from 'react';

const DashboardCard = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-2xl text-gray-800">{value}</p>
    </div>
  );
};

export default DashboardCard;
