import React from 'react';

const ReservationForm = ({ handleReservationSubmit }) => {
  return (
    <div>
      <h2>Room Reservation Form</h2>
      <form className="reservation-form" onSubmit={handleReservationSubmit}>
        <div className="form-group">
          <label htmlFor="roomNumber">Room Number:</label>
          <input type="text" id="roomNumber" name="roomNumber" required />
        </div>
        <div className="form-group">
          <label htmlFor="checkInDate">Check-In Date:</label>
          <input type="date" id="checkInDate" name="checkInDate" required />
        </div>
        <div className="form-group">
          <label htmlFor="checkOutDate">Check-Out Date:</label>
          <input type="date" id="checkOutDate" name="checkOutDate" required />
        </div>
        <button type="submit">Submit Reservation</button>
      </form>
    </div>
  );
};

export default ReservationForm;
