import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import UserTable from './components/UserTable';
import ReservationForm from './components/Reservation';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ room: '', date: '', time: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5200/users');
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again later.");
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5200/reserve-room', formData);
      setShowModal(false);
      setFormData({ room: '', date: '', time: '' });
    } catch (err) {
      console.error("Error reserving room:", err);
      setError("Failed to reserve room. Please try again later.");
    }
  };

  const approveUser = async (username) => {
    try {
      await axios.post('http://localhost:5200/approve', { username });
      setUsers(users.map(user => user.username === username ? { ...user, isApproved: true } : user));
    } catch (err) {
      console.error("Error approving user:", err);
      setError("Failed to approve user. Please try again later.");
    }
  };

  const deleteUser = async (username) => {
    try {
      await axios.delete('http://localhost:5200/delete-user', { data: { username } });
      setUsers(users.filter(user => user.username !== username));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again later.");
    }
  };

  const setPending = async (username) => {
    try {
      await axios.post('http://localhost:5200/set-pending', { username });
      setUsers(users.map(user => user.username === username ? { ...user, isApproved: false } : user));
    } catch (err) {
      console.error("Error setting user to pending:", err);
      setError("Failed to set user to pending. Please try again later.");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <div className="flex">
      <Sidebar setShowReservationForm={setShowReservationForm} logout={logout} />
      <div className="flex-1">
        <Topbar />
        <div className="p-4">
          {error && <p className="error text-red-500">{error}</p>}
          {!showReservationForm ? (
            <UserTable users={users} approveUser={approveUser} setPending={setPending} deleteUser={deleteUser} />
          ) : (
            <>
              <h2 className="text-2xl mb-4">Room Reservations</h2>
              <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Add Room Reservation</button>
              {showModal && (
                <ReservationForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleReservationSubmit={handleReservationSubmit}
                  setShowModal={setShowModal}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
``
