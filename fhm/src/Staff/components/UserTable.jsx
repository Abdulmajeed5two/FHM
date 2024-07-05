import React from 'react';
import ReservationForm from './ReservationForm';

const UserTable = ({ showReservationForm, handleReservationSubmit }) => {
  return (
    <div className="p-4">
      {showReservationForm ? (
        <ReservationForm handleReservationSubmit={handleReservationSubmit} />
      ) : (
        <h2>Welcome to the Staff Panel</h2>
      )}
    </div>
  );
};

export default UserTable;
