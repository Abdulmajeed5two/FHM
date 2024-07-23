import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CleaningForm = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [cleanedStatus, setCleanedStatus] = useState('cleaned'); 
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:5200/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched rooms:', res.data);
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      toast.error("Failed to fetch rooms. Please try again later.");
    }
  };

  const handleCleaningUpdate = async (e) => {
    e.preventDefault();
    const url = `http://localhost:5200/rooms/update-cleaning-status`;

    try {
      const response = await axios.post(url, {
        roomNo: roomNumber,
        cleaningStatus: cleanedStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        toast.success(`Room marked as cleaned successfully!`);
        resetForm();
        fetchRooms();
        setIsModalOpen(false);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (err) {
      console.error(`Error marking room as cleaned:`, err.response ? err.response.data : err.message);
      toast.error(`Failed to mark room as cleaned. Please try again later.`);
    }
  };

  const resetForm = () => {
    setRoomNumber('');
    setCleanedStatus('cleaned');
  };

  const filteredRooms = rooms.filter(room =>
    room.roomNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-24">
      <ToastContainer />
      <h2 className="text-2xl mb-4 text-center">Room Cleaning Status</h2>
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
          onClick={() => setIsModalOpen(true)}
          className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500 transition duration-300"
        >
          Update Cleaning Status
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h2 className="text-xl mb-4 text-center">Update Cleaning Status</h2>
            <form onSubmit={handleCleaningUpdate} className="space-y-4">
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
                      {room.roomNo} - {room.type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Cleaned Status:</label>
                <select
                  value={cleanedStatus}
                  onChange={(e) => setCleanedStatus(e.target.value)}
                  required
                  className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-red-600 transition-colors duration-300"
                >
                  <option value="cleaned">cleaned</option>
                  <option value="uncleaned">uncleaned</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition duration-300 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse bg-white border-separate border-spacing-2 border border-red-500">
          <thead>
            <tr className="bg-red-200">
              <th className="p-3 border-b">Room Number</th>
              <th className="p-3 border-b">Type</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Cleaning Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map(room => (
              <tr key={room.roomNo} className="border-b hover:bg-gray-100 text-center">
                <td className="p-3">{room.roomNo}</td>
                <td className="p-3">{room.type}</td>
                <td className="p-3">{room.status}</td>
                <td className="p-3">{room.cleaningStatus || 'uncleaned'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CleaningForm;
