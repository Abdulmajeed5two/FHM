import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddRoom = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('Deluxe');
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
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

    fetchRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roomNoWithPrefix = `${roomNumber}`;
    try {
      await axios.post('http://localhost:5200/rooms/add-room', {
        roomNo: roomNoWithPrefix,
        type: roomType
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Room added successfully!');
      setRoomNumber('');
      setRoomType('Deluxe');
      setIsModalOpen(false);
      const res = await axios.get('http://localhost:5200/rooms', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRooms(res.data);
    } catch (err) {
      console.error("Error adding room:", err.response ? err.response.data : err.message);
      toast.error('Failed to add room. Please try again later.');
    }
  };

  const handleDelete = async (roomNo) => {
    try {
      await axios.delete(`http://localhost:5200/rooms/${roomNo}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Room deleted successfully!');
      setRooms(rooms.filter(room => room.roomNo !== roomNo));
    } catch (err) {
      console.error("Error deleting room:", err.response ? err.response.data : err.message);
      toast.error('Failed to delete room. Please try again later.');
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
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
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  required
                  className="border p-2 rounded w-full"
                >
                  <option value="Deluxe">Deluxe</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
                  Add Room
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
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
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.roomNo} className="hover:bg-gray-100 text-center">
              <td className="border px-4 py-2">{room.roomNo}</td>
              <td className="border px-4 py-2">{room.type}</td>
              <td className="border px-4 py-2">{room.status}</td>
              <td className="border px-4 py-2">{new Date(room.createdAt).toLocaleDateString()}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => handleDelete(room.roomNo)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddRoom;
