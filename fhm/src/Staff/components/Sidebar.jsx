import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'material-design-iconic-font/dist/css/material-design-iconic-font.min.css';
import styles from './style/Sidebar.module.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ setActiveComponent }) => {
  const [role, setRole] = useState(localStorage.getItem('role'));
  const navigate = useNavigate();

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
          <button 
            onClick={() => setActiveComponent('dashboard')}
            className={styles.button}
          >
            <i className={`${styles.icon} zmdi zmdi-home zmdi-hc-lg`}></i>
            <span>Dashboard</span>
          </button>
        </li>
        <li className={styles.navItem}>
          <button 
            onClick={() => setActiveComponent('roomReservation')}
            className={styles.button}
          >
            <i className={`${styles.icon} zmdi zmdi-calendar-check zmdi-hc-lg`}></i>
            <span>Room Reservation</span>
          </button>
        </li>
        
        <li className={styles.navItem}>
          <button 
            onClick={() => setActiveComponent('inventory')}
            className={styles.button}
          >
            <i className={`${styles.icon} zmdi zmdi-store zmdi-hc-lg`}></i>
            <span>Inventory Management</span>
          </button>
        </li>
        <li className={styles.navItem}>
          <button 
            onClick={logout} 
            className={styles.button}
          >
            <i className={`${styles.icon} zmdi zmdi-power zmdi-hc-lg`}></i>
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
