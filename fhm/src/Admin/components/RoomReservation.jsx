import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RoomReservation = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://localhost:5200/rooms');
        setRooms(res.data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };

    fetchRooms();
  }, []);

  const handleReserveRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5200/reserve-room', {
        userName,
        roomNo: roomNumber,
        checkInDate,
        checkOutDate,
      });
      toast.success('Room reserved successfully!');
      resetForm();
      setIsModalOpen(false);
      const res = await axios.get('http://localhost:5200/rooms');
      setRooms(res.data); // Refresh room list
    } catch (err) {
      console.error("Error reserving room:", err.response ? err.response.data : err.message);
      toast.error('Failed to reserve room. Please try again later.');
    }
  };

  const resetForm = () => {
    setUserName('');
    setRoomNumber('');
    setCheckInDate('');
    setCheckOutDate('');
  };

  return (
    <div className="mt-24">
      <h2 className="text-2xl mb-4">Room Reservation</h2>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
      >
        Room Reservation
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h2 className="text-xl mb-4">Reserve Room</h2>
            <form onSubmit={handleReserveRoom} className="space-y-4">
              <div>
                <label className="block mb-1">User Name:</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-red-600 transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block mb-1">Room Number:</label>
                <select
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                  className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-red-600 transition-colors duration-300"
                >
                  <option value="">Select Room</option>
                  {rooms.map((room) => (
                    <option key={room.roomNo} value={room.roomNo}>
                      {room.roomNo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Check-In Date:</label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  required
                  className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-red-600 transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block mb-1">Check-Out Date:</label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  required
                  className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-red-600 transition-colors duration-300"
                />
              </div>
              <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 mt-4">
                Reserve Room
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded mt-4 ml-2 hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <h3 className="text-xl mt-12">Added Rooms</h3>
      <table className="min-w-full border mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Room No</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Date Added</th>
            <th className="border px-4 py-2">Reserved By</th>
            <th className="border px-4 py-2">Check-In Date</th>
            <th className="border px-4 py-2">Check-Out Date</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.roomNo}>
              <td className="border px-4 py-2">{room.roomNo}</td>
              <td className="border px-4 py-2">{room.type}</td>
              <td className="border px-4 py-2">{room.status}</td>
              <td className="border px-4 py-2">{new Date(room.createdAt).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{room.reservedBy || 'Available'}</td>
              <td className="border px-4 py-2">{room.checkInDate || 'N/A'}</td>
              <td className="border px-4 py-2">{room.checkOutDate || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomReservation;
