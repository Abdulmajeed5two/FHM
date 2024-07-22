import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Inventory = () => {
  const [inventoryData, setInventoryData] = useState({ itemName: '', roomId: '', quantity: '' });
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    const fetchRoomsAndInventory = async () => {
      const token = localStorage.getItem('token'); 
      try {
        const [roomsRes, inventoryRes] = await Promise.all([
          axios.get('http://localhost:5200/rooms', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5200/inventory', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setRooms(roomsRes.data);
        setInventoryItems(inventoryRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchRoomsAndInventory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInventoryData({ ...inventoryData, [name]: value });
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); 
    try {
      await axios.post('http://localhost:5200/inventory/add-item', inventoryData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Inventory item added successfully!');
      setInventoryData({ itemName: '', roomId: '', quantity: '' });
      // Refresh inventory items
      const res = await axios.get('http://localhost:5200/inventory', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventoryItems(res.data);
    } catch (err) {
      console.error("Error adding inventory:", err);
      setError("Failed to add inventory. Please try again later.");
    }
  };

  
  const getRoomNumber = (roomId) => {
    const room = rooms.find(room => room._id === roomId);
    return room ? room.roomNo : 'Unknown';
  };

  return (
    <div className="p-6 mt-16">
      <h3 className="text-xl mb-6 text-red-600">Add Inventory Item</h3>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleInventorySubmit} className="mb-4">
        <div className="mb-4">
          <label className="block mb-1">Item Name:</label>
          <input 
            type="text" 
            name="itemName" 
            value={inventoryData.itemName} 
            onChange={handleInputChange} 
            required 
            className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-red-600 transition-colors duration-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Room:</label>
          <select 
            name="roomId" 
            value={inventoryData.roomId} 
            onChange={handleInputChange} 
            required 
            className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-red-600 transition-colors duration-300"
          >
            <option value="" disabled>Select a room</option>
            {rooms.length > 0 ? (
              rooms.map(room => (
                <option key={room._id} value={room._id}>{room.roomNo}</option>
              ))
            ) : (
              <option value="" disabled>No rooms available</option>
            )}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Quantity:</label>
          <input 
            type="number" 
            name="quantity" 
            value={inventoryData.quantity} 
            onChange={handleInputChange} 
            required 
            className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-red-600 transition-colors duration-300"
          />
        </div>
        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300">
          Add Inventory
        </button>
      </form>

      <h3 className="text-lg mb-4 text-red-600">Current Inventory Items</h3>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Item Name</th>
            <th className="border px-4 py-2">Room No</th>
            <th className="border px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {inventoryItems.map(item => (
            <tr key={item._id}>
              <td className="border px-4 py-2">{item.itemName}</td>
              <td className="border px-4 py-2">{getRoomNumber(item.roomId)}</td>
              <td className="border px-4 py-2">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
