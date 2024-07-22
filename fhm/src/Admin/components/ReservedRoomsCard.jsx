import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookmarkIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const ReservedRoomsCard = () => {
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
        const response = await axios.get('http://localhost:5200/rooms/reserved-rooms', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setValue(response.data.value);
      } catch (err) {
        setError('Error fetching data');
        console.error('Error fetching reserved rooms:', err);
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
      <div className={`bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 ${cardStyle}`}>
        <InformationCircleIcon className={`text-white ${iconStyle}`} />
        <h3 className={`text-white ${titleStyle}`}>Reserved Rooms</h3>
        <p className="text-gray-200">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 ${cardStyle}`}>
        <ExclamationCircleIcon className={`text-white ${iconStyle}`} />
        <h3 className={`text-white ${titleStyle}`}>Reserved Rooms</h3>
        <p className="text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 ${cardStyle}`}>
      <BookmarkIcon className={`text-white ${iconStyle}`} />
      <h3 className={`text-white ${titleStyle}`}>Reserved Rooms</h3>
      <p className={`text-white ${valueStyle}`}>{value}</p>
    </div>
  );
};

export default ReservedRoomsCard;
