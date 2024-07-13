import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddRoom = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5200/rooms/add-room', {
        roomNo: roomNumber,
        type: roomType
      });
      toast.success('Room added successfully!');
      setRoomNumber('');
      setRoomType('');
      setIsModalOpen(false);
      const res = await axios.get('http://localhost:5200/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error("Error adding room:", err.response ? err.response.data : err.message);
      toast.error('Failed to add room. Please try again later.');
    }
  };

  return (
    <div className="mt-24">
      <h2 className="text-2xl mb-4">Room Management</h2>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Add Room
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl mb-4">Add Room</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block">Room Number:</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block">Room Type:</label>
                <input
                  type="text"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  required
                  className="border p-2 rounded w-full"
                />
              </div>
              <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded mt-4">
                Add Room
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded mt-4 ml-2"
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
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.roomNo}>
              <td className="border px-4 py-2">{room.roomNo}</td>
              <td className="border px-4 py-2">{room.type}</td>
              <td className="border px-4 py-2">{room.status}</td>
              <td className="border px-4 py-2">{new Date(room.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddRoom;
