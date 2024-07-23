import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FaSun, FaMoon, FaUser } from 'react-icons/fa';
import styles from './style/Topbar.module.css';

const Topbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get('http://localhost:5200/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();

    // Check for dark mode preference on component mount
    const currentMode = document.documentElement.classList.contains('dark');
    setIsDarkMode(currentMode);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`${styles.topbar} ${isDarkMode ? styles.topbarDark : styles.topbarLight} bg-gradient-to-r from-red-400 via-red-500 to-red-600`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <button 
          className={`${styles.button} ${isDarkMode ? styles.buttonDark : styles.buttonLight} p-2 rounded`}
          onClick={toggleDarkMode}
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <FaSun className="h-6 w-6 text-white" /> : <FaMoon className="h-6 w-6 text-white" />}
        </button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaUser className="text-white h-8 w-8" />
            <span className="text-white text-xl font-semibold">
              {loading ? 'Loading...' : username || 'User'}
            </span>
          </div>
        </div>
      </div>
      {error && (
        <div className={`${styles.errorMessage} text-red-500 mt-2 text-center`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Topbar;
