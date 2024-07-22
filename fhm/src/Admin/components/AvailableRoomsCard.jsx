import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const AvailableRoomsCard = () => {
  const [value, setValue] = useState(0);
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
        const response = await axios.get('http://localhost:5200/rooms/available-rooms', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setValue(response.data.value);
      } catch (err) {
        setError('Error fetching data');
        console.error('Error fetching available rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const iconStyle = 'h-10 w-10 mb-2';
  const titleStyle = 'text-xl font-semibold mb-2';
  const valueStyle = 'text-3xl font-bold';
  const cardStyle = 'p-6 rounded-lg shadow-lg flex flex-col items-center justify-center transform transition-transform hover:scale-105';

  if (loading) {
    return (
      <div className={`bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 ${cardStyle}`}>
        <InformationCircleIcon className={`text-white ${iconStyle}`} />
        <h3 className={`text-white ${titleStyle}`}>Available Rooms</h3>
        <p className="text-gray-200">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gradient-to-r from-red-400 via-red-500 to-red-600 ${cardStyle}`}>
        <ExclamationCircleIcon className={`text-white ${iconStyle}`} />
        <h3 className={`text-white ${titleStyle}`}>Available Rooms</h3>
        <p className="text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 ${cardStyle}`}>
      <CheckCircleIcon className={`text-white ${iconStyle}`} />
      <h3 className={`text-white ${titleStyle}`}>Available Rooms</h3>
      <p className={`text-white ${valueStyle}`}>{value}</p>
    </div>
  );
};

export default AvailableRoomsCard;
