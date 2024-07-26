import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../components/style/st.css'

const InventoryForm = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [inventoryStatus, setInventoryStatus] = useState('added');
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:5200/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(res.data);
      initializeCheckedItems(res.data); 
    } catch (err) {
      console.error("Error fetching rooms:", err);
      toast.error("Failed to fetch rooms. Please try again later.");
    }
  };

  const initializeCheckedItems = (rooms) => {
    const items = {};
    rooms.forEach(room => {
      items[room.roomNo] = {
        'Bed Sheet': room.inventoryStatus === 'added',
        'Towels': room.inventoryStatus === 'added',
        'Toiletries': room.inventoryStatus === 'added'
      };
    });
    setCheckedItems(items);
  };

  const handleInventoryUpdate = async (e) => {
    e.preventDefault();
    const url = `http://localhost:5200/rooms/update-inventory-status`;

    try {
      const response = await axios.post(url, {
        roomNo: roomNumber,
        inventoryStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        toast.success('Room inventory status updated successfully!');
        setCheckedItems(prev => ({
          ...prev,
          [roomNumber]: {
            'Bed Sheet': inventoryStatus === 'added',
            'Towels': inventoryStatus === 'added',
            'Toiletries': inventoryStatus === 'added'
          }
        }));
        resetForm();
        fetchRooms();
        setIsModalOpen(false);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (err) {
      console.error(`Error updating room inventory status:`, err.response ? err.response.data : err.message);
      toast.error('Failed to update room inventory status. Please try again later.');
    }
  };

  const resetForm = () => {
    setRoomNumber('');
    setInventoryStatus('added');
  };

  const handleCheckboxChange = (roomNo, item) => {
    setCheckedItems(prev => ({
      ...prev,
      [roomNo]: {
        ...prev[roomNo],
        [item]: !prev[roomNo]?.[item]
      }
    }));
  };

  const filteredRooms = rooms.filter(room =>
    room.roomNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableRooms = rooms.filter(room => room.inventoryStatus !== 'added');

  return (
    <div className="mt-24">
      <ToastContainer />
      <h2 className="text-2xl mb-4 text-center">Room Inventory Status</h2>
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
          Update Inventory Status
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h2 className="text-xl mb-4 text-center">Update Inventory Status</h2>
            <form onSubmit={handleInventoryUpdate} className="space-y-4">
              <div>
                <label className="block mb-1">Room Number:</label>
                <select
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                  className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-red-600 transition-colors duration-300"
                >
                  <option value="">Select Room</option>
                  {availableRooms.map((room) => (
                    <option key={room.roomNo} value={room.roomNo}>
                      {room.roomNo} - {room.type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Inventory Status:</label>
                <select
                  value={inventoryStatus}
                  onChange={(e) => setInventoryStatus(e.target.value)}
                  required
                  className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-red-600 transition-colors duration-300"
                >
                  <option value="added">Added</option>
                  <option value="empty">Empty</option>
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
              <th className="p-3 border-b">Inventory Status</th>
              <th className="p-3 border-b">Items</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map(room => (
              <tr key={room.roomNo} className="border-b hover:bg-gray-100 text-center">
                <td className="p-3">{room.roomNo}</td>
                <td className="p-3">{room.type}</td>
                <td className="p-3">{room.status}</td>
                <td className="p-3">{room.inventoryStatus || 'empty'}</td>
                <td className="p-3">
                  <div className="flex flex-col items-start">
                    {['Bed Sheet', 'Towels', 'Toiletries'].map(item => (
                      <label key={item} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="custom-checkbox"
                          checked={checkedItems[room.roomNo]?.[item] || false}
                          onChange={() => handleCheckboxChange(room.roomNo, item)}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryForm;
