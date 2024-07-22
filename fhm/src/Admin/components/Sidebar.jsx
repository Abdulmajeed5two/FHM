import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'material-design-iconic-font/dist/css/material-design-iconic-font.min.css';
import styles from './style/Sidebar.module.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ setActiveComponent }) => {
  const [rooms, setRooms] = useState([]);
  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
  const [isCleaningDropdownOpen, setIsCleaningDropdownOpen] = useState(false);
  const [role, setRole] = useState(localStorage.getItem('role'));
  const navigate = useNavigate();

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

  const toggleRoomDropdown = () => {
    setIsRoomDropdownOpen(!isRoomDropdownOpen);
  };

  const toggleCleaningDropdown = () => {
    setIsCleaningDropdownOpen(!isCleaningDropdownOpen);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>{role === 'admin' ? 'Admin Panel' : 'Staff Panel'}</h2>
      </div>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <button onClick={() => setActiveComponent('dashboard')} className={styles.button}>
            <i className={`${styles.icon} zmdi zmdi-home zmdi-hc-lg`}></i>
            <span>Dashboard</span>
          </button>
        </li>
        <li className={styles.navItem}>
          <button onClick={() => setActiveComponent('roomReservation')} className={styles.button}>
            <i className={`${styles.icon} zmdi zmdi-calendar-check zmdi-hc-lg`}></i>
            <span>Room Reservation</span>
          </button>
        </li>
        <li className={styles.navItem}>
          <div>
            <button onClick={toggleRoomDropdown} className={styles.button}>
              <i className={`${styles.icon} zmdi zmdi-hotel zmdi-hc-lg`}></i>
              <span>Rooms</span>
              <i className={`zmdi zmdi-caret-${isRoomDropdownOpen ? 'up' : 'down'} zmdi-hc-lg ml-auto`}></i>
            </button>
            <div className={`${styles.dropdown} ${isRoomDropdownOpen ? styles.dropdownOpen : ''}`}>
              <ul className={styles.dropdownList}>
                <li className={styles.dropdownItem}>
                  <button onClick={() => setActiveComponent('addRoom')} className={styles.dropdownButton}>
                    <i className={`${styles.icon} zmdi zmdi-plus zmdi-hc-lg`}></i>
                    <span>Add Room</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </li>
        <li className={styles.navItem}>
          <div>
            <button onClick={toggleCleaningDropdown} className={styles.button}>
              <i className={`${styles.icon} zmdi zmdi-clean zmdi-hc-lg`}></i>
              <span>Room Cleaning</span>
              <i className={`zmdi zmdi-caret-${isCleaningDropdownOpen ? 'up' : 'down'} zmdi-hc-lg ml-auto`}></i>
            </button>
            <div className={`${styles.dropdown} ${isCleaningDropdownOpen ? styles.dropdownOpen : ''}`}>
              <ul className={styles.dropdownList}>
                <li className={styles.dropdownItem}>
                  <button onClick={() => setActiveComponent('cleaningForm')} className={styles.dropdownButton}>
                    <i className={`${styles.icon} zmdi zmdi-plus zmdi-hc-lg`}></i>
                    <span>Add Cleaning</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </li>
        <li className={styles.navItem}>
          <button onClick={() => setActiveComponent('staffDetails')} className={styles.button}>
            <i className={`${styles.icon} zmdi zmdi-accounts zmdi-hc-lg`}></i>
            <span>Staff Details</span>
          </button>
        </li>
        <li className={styles.navItem}>
          <button onClick={() => setActiveComponent('inventory')} className={styles.button}>
            <i className={`${styles.icon} zmdi zmdi-store zmdi-hc-lg`}></i>
            <span>Inventory Management</span>
          </button>
        </li>
        <li className={styles.navItem}>
          <button onClick={() => setActiveComponent('reports')} className={styles.button}>
            <i className={`${styles.icon} zmdi zmdi-chart zmdi-hc-lg`}></i>
            <span>Reports</span>
          </button>
        </li>
        <li className={styles.navItem}>
          <button onClick={logout} className={styles.button}>
            <i className={`${styles.icon} zmdi zmdi-power zmdi-hc-lg`}></i>
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
