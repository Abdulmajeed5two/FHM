import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HomeIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const TotalRoomsCard = () => {
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          throw new Error('No token found in localStorage');
        }
        const response = await axios.get('http://localhost:5200/rooms/total-rooms', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data && typeof response.data.value === 'number') {
          setValue(response.data.value);
        } else {
          setError('Unexpected response format');
        }
      } catch (err) {
        setError(`Error fetching data: ${err.response ? err.response.data.message : err.message}`);
        console.error('Error fetching total rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center transform transition-transform hover:scale-105">
        <InformationCircleIcon className="h-10 w-10 text-white mb-2" />
        <h3 className="text-xl font-semibold mb-2 text-white">Total Rooms</h3>
        <p className="text-gray-200">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center transform transition-transform hover:scale-105">
        <ExclamationCircleIcon className="h-10 w-10 text-white mb-2" />
        <h3 className="text-xl font-semibold mb-2 text-white">Total Rooms</h3>
        <p className="text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center transform transition-transform hover:scale-105">
      <HomeIcon className="h-10 w-10 text-white mb-2" />
      <h3 className="text-xl font-semibold mb-2 text-white">Total Rooms</h3>
      <p className="text-3xl text-white font-bold">{value}</p>
    </div>
  );
};

export default TotalRoomsCard;
