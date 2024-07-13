import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RoomDetails = () => {
  const [rooms, setRooms] = useState([]);
  
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://localhost:5200/rooms');
        setRooms(res.data);
      } catch (err) {
        console.error("Error fetching room details:", err);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div>
      <h3 className="text-xl mb-4">Room Details</h3>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Room Number</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room.id}>
              <td className="border px-4 py-2">{room.number}</td>
              <td className="border px-4 py-2">{room.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomDetails;
