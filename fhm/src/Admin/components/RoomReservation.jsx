import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RoomReservation = () => {
  const [roomNumber, setRoomNumber] = useState('R-');
  const [userName, setUserName] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [amount, setAmount] = useState('');
  const [rooms, setRooms] = useState([]);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cleaned, setCleaned] = useState('no'); 
  const [inventoryStatus, setInventoryStatus] = useState('good'); 

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:5200/rooms', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  const handleReserveRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5200/rooms/reserve-room', {
        userName,
        roomNo: roomNumber,
        checkInDate,
        checkOutDate,
        amount,
        cleaned, 
        inventoryStatus, 
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Room reserved successfully!');
      resetForm();
      setIsReserveModalOpen(false);
      fetchRooms();
    } catch (err) {
      console.error("Error reserving room:", err.response ? err.response.data : err.message);
      toast.error('Failed to reserve room. Please try again later.');
    }
  };

  const handleCheckoutRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5200/rooms/checkout-room', {
        roomNo: roomNumber,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Room checked out successfully!');
      setCheckoutData(null);
      setRoomNumber('R-');
      setIsCheckoutModalOpen(false);
      fetchRooms();
    } catch (err) {
      console.error("Error checking out room:", err.response ? err.response.data : err.message);
      toast.error('Failed to check out room. Please try again later.');
    }
  };

  const handleRoomSearch = () => {
    const room = rooms.find(r => r.roomNo === roomNumber);
    if (room) {
      setCheckoutData(room);
    } else {
      toast.error('Room not found.');
    }
  };


  const filteredRooms = rooms.filter(room =>
    room.status !== 'reserved' &&
    room.roomNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setUserName('');
    setRoomNumber('R-');
    setCheckInDate('');
    setCheckOutDate('');
    setAmount('');
    setCleaned('no'); 
    setInventoryStatus('good'); 
  };

  return (
    <div className="mt-24">
      <ToastContainer />
      <h2 className="text-2xl mb-4 text-center">Room Reservation</h2>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search for room..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-b w-1/2 h-10 text-sm px-2 focus:outline-none focus:border-red-600 transition-colors duration-300"
        />
      </div>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setIsReserveModalOpen(true)}
          className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500 transition duration-300 mx-2"
        >
          Room Reservation
        </button>
      </div>

      {isReserveModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h2 className="text-xl mb-4 text-center">Reserve Room</h2>
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
                  <option value="R-">Select Room</option>
                  {filteredRooms.map((room) => (
                    <option key={room.roomNo} value={room.roomNo}>
                      {room.roomNo} - {room.type}
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
              <div>
                <label className="block mb-1">Amount ($):</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-red-600 transition-colors duration-300"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsReserveModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition duration-300 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                >
                  Reserve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCheckoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h2 className="text-xl mb-4 text-center">Checkout Room</h2>
            <form onSubmit={handleCheckoutRoom} className="space-y-4">
              <div>
                <label className="block mb-1">Room Number:</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                  className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-red-600 transition-colors duration-300"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition duration-300 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                >
                  Checkout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 px-4 ">Room Number</th>
              <th className="py-2 px-4 ">Room Type</th>
              <th className="py-2 px-4 ">Status</th>
              <th className="py-2 px-4 ">Check-In Date</th>
              <th className="py-2 px-4 ">Check-Out Date</th>
              <th className="py-2 px-4 ">Amount</th>
              <th className="py-2 px-4 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.roomNo} className="border-b border-gray-200 text-center">
                <td className="py-2 px-4">{room.roomNo}</td>
                <td className="py-2 px-4">{room.type}</td>
                <td className="py-2 px-4">{room.status}</td>
                <td className="py-2 px-4">{room.checkInDate ? new Date(room.checkInDate).toLocaleDateString() : '-'}</td>
                <td className="py-2 px-4">{room.checkOutDate ? new Date(room.checkOutDate).toLocaleDateString() : '-'}</td>
                <td className="py-2 px-4">${room.amount || '-'}</td>
                <td className="py-2 px-4">
                  {room.status === 'reserved' ? (
                    <button
                      onClick={() => {
                        setRoomNumber(room.roomNo);
                        handleRoomSearch();
                        setIsCheckoutModalOpen(true);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                    >
                      Checkout
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setRoomNumber(room.roomNo);
                        setIsReserveModalOpen(true);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                    >
                      Reserve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomReservation;
