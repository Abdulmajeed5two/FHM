import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StaffDetails = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const token = localStorage.getItem('token');
  const modalRef = useRef();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get('http://localhost:5200/user', {
          headers: {
            Authorization: `Bearer ${token}`,
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (searchTerm) {
      const matchedStaff = staff.find(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSelectedStaff(matchedStaff || null);
    } else {
      setSelectedStaff(null);
    }
  }, [searchTerm, staff]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5200/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStaff(staff.filter(member => member._id !== id));
      toast.success("Staff member deleted successfully");
    } catch (err) {
      console.error("Error deleting staff member:", err);
      toast.error("Failed to delete staff member");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5200/user/${id}`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStaff(staff.map(member => member._id === id ? { ...member, status } : member));
      toast.success("Staff status updated successfully");
    } catch (err) {
      console.error("Error updating staff status:", err);
      toast.error("Failed to update staff status");
    }
  };

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <ToastContainer />
      <h3 className="text-xl mb-12 text-center">Staff Details</h3>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search for staff..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-b w-1/2 h-10 text-sm px-2 focus:outline-none focus:border-red-600 transition-colors duration-300"
        />
      </div>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
        >
          Update Staff Status
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div ref={modalRef} className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h2 className="text-xl mb-4 text-center">Update Staff Status</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (selectedStaff) {
                handleStatusChange(selectedStaff._id, selectedStaff.status);
              }
            }} className="space-y-4">
              <div>
                <label className="block mb-1">Staff Name:</label>
                <select
                  value={selectedStaff?._id || ''}
                  onChange={(e) => setSelectedStaff(staff.find(member => member._id === e.target.value))}
                  required
                  className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-red-600 transition-colors duration-300"
                >
                  <option value="">Select Staff</option>
                  {filteredStaff.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Status:</label>
                <select
                  value={selectedStaff?.status || ''}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, status: e.target.value })}
                  required
                  className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-red-600 transition-colors duration-300"
                >
                  <option value="active">active</option>
                  <option value="pending">Pending</option>
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
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Role</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map(member => (
              <tr key={member._id} className="border-b hover:bg-red-100 text-center">
                <td className="p-3">{member.name}</td>
                <td className="p-3">{member.role}</td>
                <td className="p-3">{member.status}</td>
                <td className="p-3">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(member._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffDetails;
