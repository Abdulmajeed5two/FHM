import React from 'react';

const UserTable = ({ users, approveUser, setPending, deleteUser }) => {
  return (
    <div>
      <h2 className="text-2xl mb-4">Registered Users</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Username</th>
            <th className="py-2 px-4 border">Role</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td className="py-2 px-4 border">{user.username}</td>
              <td className="py-2 px-4 border">{user.role}</td>
              <td className="py-2 px-4 border">{user.isApproved ? 'Approved' : 'Pending'}</td>
              <td className="py-2 px-4 border space-x-2">
                {!user.isApproved ? (
                  <button onClick={() => approveUser(user.username)} className="bg-green-500 text-white px-2 py-1 rounded">Approve</button>
                ) : (
                  <button onClick={() => setPending(user.username)} className="bg-yellow-500 text-white px-2 py-1 rounded">Set Pending</button>
                )}
                <button onClick={() => deleteUser(user.username)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
