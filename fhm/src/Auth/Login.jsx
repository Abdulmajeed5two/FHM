import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'material-design-iconic-font/dist/css/material-design-iconic-font.min.css';

const Login = () => {
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5200/login', { username, password });
      localStorage.setItem('token', res.data.token);
      const userRole = JSON.parse(atob(res.data.token.split('.')[1])).role;
      localStorage.setItem('role', userRole);

      if (userRole === 'admin') {
        toast.success('Login successful! Redirecting to admin dashboard...');
        navigate('/admin');
      } else if (userRole === 'waiting') {
        toast.info('You are in the waiting list. Redirecting...');
        navigate('/waitinglist');
      } else {
        toast.success('Login successful! Redirecting to staff panel...');
        navigate('/staff');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center" style={{ backgroundImage: "url('src/assets/Auth/bgg.jpg')" }}>
      <ToastContainer />
      {!showForm && (
        <motion.div
          className="absolute w-40 h-40 bg-gradient-to-r from-green-400 to-green-600 text-white flex items-center justify-center rounded-full cursor-pointer"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          onClick={() => setShowForm(true)}
        >
          <h2 className="text-xl font-semibold">FarmHouse</h2>
        </motion.div>
      )}
      {showForm && (
        <motion.div
          className="bg-white max-w-4xl mx-auto flex shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-1/2">
            <img src="src/assets/Auth/l1.jpg" alt="login" className="w-full h-full object-cover" />
          </div>
          <form onSubmit={handleSubmit} className="w-1/2 p-10 flex flex-col justify-center">
            <h3 className="text-2xl font-semibold text-center mb-7 uppercase">Login Form</h3>
            <div className="relative mb-6">
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-black transition-colors duration-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <i className="zmdi zmdi-account absolute bottom-2 right-0 transition-transform duration-300 transform group-hover:scale-110"></i>
            </div>
            <div className="relative mb-6">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-black transition-colors duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className="zmdi zmdi-lock absolute bottom-2 right-0 transition-transform duration-300 transform group-hover:scale-110"></i>
            </div>
            <button type="submit" className="bg-black text-white w-40 h-12 mx-auto mt-10 flex items-center justify-center hover:bg-opacity-80 transition duration-300 group">
              Login
              <i className="zmdi zmdi-arrow-right ml-2 transition-transform duration-300 transform group-hover:translate-x-1"></i>
            </button>
            <div className="mt-10 text-center">
              <p>Don't have an account?
                <Link to="/register" className="text-black underline ml-1">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default Login;
