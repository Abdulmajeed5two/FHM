import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFilter } from 'react-icons/fa'; 

const ReservedRooms = () => {
  const [reservedRooms, setReservedRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [error, setError] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [roomNumber, setRoomNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchReservedRooms = async () => {
      try {
        const res = await axios.get('http://localhost:5200/rooms/reserved', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setReservedRooms(res.data);
        setFilteredRooms(res.data);
      } catch (err) {
        console.error("Error fetching reserved rooms:", err);
        toast.error("Failed to fetch reserved rooms.");
        setError('Failed to fetch reserved rooms.');
      }
    };

    fetchReservedRooms();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = reservedRooms.filter(room => {
        const checkInDate = new Date(room.checkInDate);
        const checkOutDate = new Date(room.checkOutDate);
        return checkInDate >= new Date(startDate) && checkOutDate <= new Date(endDate);
      });
      setFilteredRooms(filtered);
    } else {
      setFilteredRooms(reservedRooms);
    }
  }, [startDate, endDate, reservedRooms]);

  const handleCheckoutRoom = async () => {
    if (!checkoutData) {
      toast.error('No room selected for checkout.');
      return;
    }

    try {
      await axios.post('http://localhost:5200/rooms/checkout-room', {
        roomNo: checkoutData.roomNo,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Room checked out successfully!');
      setCheckoutData(null);
      setRoomNumber('');
      setIsCheckoutModalOpen(false);
      const updatedRooms = reservedRooms.filter(room => room.roomNo !== checkoutData.roomNo);
      setReservedRooms(updatedRooms);
      setFilteredRooms(updatedRooms);
    } catch (err) {
      console.error("Error checking out room:", err.response ? err.response.data : err.message);
      toast.error('Failed to check out room. Please try again later.');
    }
  };

  const handleRoomSearch = () => {
    const room = filteredRooms.find(r => r.roomNo === roomNumber);
    if (room) {
      setCheckoutData(room);
      setIsCheckoutModalOpen(true);
    } else {
      toast.error('Room not found.');
    }
  };

  return (
    <div className="flex flex-col items-center p-6 relative">
      <ToastContainer />
      <h3 className="text-2xl mb-6 text-red-600 font-bold">Reserved Rooms</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex justify-end mb-6 absolute top-6 right-6">
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition duration-300"
        >
          <FaFilter className="w-6 h-6" />
        </button>
      </div>

      <div className="w-full max-w-5xl overflow-x-auto">
        <table className="min-w-full border border-red-300 text-center">
          <thead className="bg-red-200">
            <tr>
              <th className="border px-4 py-2">Room No</th>
              <th className="border px-4 py-2">Reserved By</th>
              <th className="border px-4 py-2">Check-in Date</th>
              <th className="border px-4 py-2">Check-out Date</th>
              <th className="border px-4 py-2">Status</th> 
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.length > 0 ? (
              filteredRooms.map(room => (
                <tr key={room._id}>
                  <td className="border px-4 py-2">{room.roomNo}</td>
                  <td className="border px-4 py-2">{room.reservedBy}</td>
                  <td className="border px-4 py-2">{new Date(room.checkInDate).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{new Date(room.checkOutDate).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{room.status}</td> 
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => {
                        setRoomNumber(room.roomNo);
                        handleRoomSearch();
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                    >
                      Checkout
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="border px-4 py-2 text-center">No reserved rooms found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFilterModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-xl mb-4 text-red-600 font-bold">Filter Rooms by Date</h3>
            <label className="block mb-2 text-gray-700">
              Start Date:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-2 py-1 mt-1 w-full"
              />
            </label>
            <label className="block mb-2 text-gray-700">
              End Date:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded px-2 py-1 mt-1 w-full"
              />
            </label>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {isCheckoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-xl mb-4 text-red-600 font-bold">Checkout Room</h3>
            {checkoutData ? (
              <>
                <p><strong>Room No:</strong> {checkoutData.roomNo}</p>
                <p><strong>Reserved By:</strong> {checkoutData.reservedBy}</p>
                <p><strong>Check-in Date:</strong> {new Date(checkoutData.checkInDate).toLocaleDateString()}</p>
                <p><strong>Check-out Date:</strong> {new Date(checkoutData.checkOutDate).toLocaleDateString()}</p>
                <p><strong>Amount:</strong> ${checkoutData.amount}</p>
              </>
            ) : (
              <p>No room data available.</p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckoutRoom}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservedRooms;
