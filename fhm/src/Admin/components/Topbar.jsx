import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Topbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get('http://localhost:5200/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUsername();

    const currentMode = document.documentElement.classList.contains('dark');
    setIsDarkMode(currentMode);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="bg-red-400 dark:bg-gray-800 ml-64 fixed top-4 left-4 right-4 shadow-md z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end items-center">
        <button 
          className="text-white dark:text-gray-400 mr-4 p-2 rounded-full hover:bg-red-600 dark:hover:bg-gray-700 transition-colors duration-300"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
        </button>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="text-white dark:text-gray-400 p-2 rounded-full hover:bg-red-600 dark:hover:bg-gray-700 transition-colors duration-300">
              <i className="fas fa-bell"></i>
            </button>
            <div className="absolute right-0 top-0 bg-red-600 dark:bg-gray-600 text-white dark:text-gray-200 text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </div>
          </div>
          <div className="relative">
            <button 
              className="text-white dark:text-gray-400 p-2 rounded-full hover:bg-red-600 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center space-x-2" 
              onClick={toggleDropdown}
            >
              <i className="fas fa-user"></i>
              <span>{username}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-2 transition-transform duration-300 transform origin-top-right scale-95">
                <a 
                  href="/profile" 
                  className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  My Profile
                </a>
                <a 
                  href="/settings" 
                  className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  Settings
                </a>
                <a 
                  href="/logout" 
                  className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
