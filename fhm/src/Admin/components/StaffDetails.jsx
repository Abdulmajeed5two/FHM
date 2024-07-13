import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StaffDetails = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token'); // Get the token from local storage

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get('http://localhost:5200/user', {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token
          },
        });
        setStaff(res.data);
      } catch (err) {
        console.error("Error fetching staff details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5200/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      });
      setStaff(staff.filter(member => member._id !== id));
    } catch (err) {
      console.error("Error deleting staff member:", err);
    }
  };

  const handleSetPending = async (id) => {
    try {
      await axios.patch(`http://localhost:5200/user/${id}`, { status: 'pending' }, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      });
      setStaff(staff.map(member => member._id === id ? { ...member, status: 'pending' } : member));
    } catch (err) {
      console.error("Error updating staff status:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h3 className="text-xl mb-12 text-center">Staff Details</h3>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-center">Name</th>
            <th className="border px-4 py-2 text-center">Role</th>
            <th className="border px-4 py-2 text-center">Status</th>
            <th className="border px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {staff.map(member => (
            <tr key={member._id}>
              <td className="border px-4 py-2 text-center">{member.name}</td>
              <td className="border px-4 py-2 text-center">{member.role}</td>
              <td className="border px-4 py-2 text-center">
                {member.status === 'pending' ? 'Pending' : 'Active'}
              </td>
              <td className="border px-4 py-2 text-center">
                <button 
                  className="text-red-500" 
                  onClick={() => handleDelete(member._id)}
                >
                  Delete
                </button>
                <button 
                  className="ml-2 text-yellow-500" 
                  onClick={() => handleSetPending(member._id)}
                >
                  Set Pending
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffDetails;
