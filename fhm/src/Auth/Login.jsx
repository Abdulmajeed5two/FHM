import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';
import Loader from '../components/Loader';
import 'react-toastify/dist/ReactToastify.css';
import 'material-design-iconic-font/dist/css/material-design-iconic-font.min.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

const Login = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5200/auth/login', { username, password });
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
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      await axios.post('http://localhost:5200/forget-password', { email });
      toast.success('Verification email sent. Please check your inbox.');
      closeModal();
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center" style={{ backgroundImage: "url('src/assets/Auth/bgl.jpg')" }}>
      <ToastContainer />
      <div className="bg-white max-w-4xl mx-auto flex shadow-lg">
        <div className="w-1/2">
          <img src="src/assets/Auth/l.jpg" alt="login" className="w-full h-full object-cover" />
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
              <Link to="/register" className="text-black ml-1">Register</Link>
            </p>
            <p className="mt-4">
              <button type="button" onClick={openModal} className="text-black underline ml-1">
                Forget Password?
              </button>
            </p>
          </div>
        </form>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Forget Password"
      >
        <h2 className="text-2xl font-semibold text-center mb-7 uppercase">Forget Password</h2>
        <form onSubmit={handlePasswordReset} className="flex flex-col">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-black transition-colors duration-300 mb-6"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="bg-black text-white w-40 h-12 mx-auto mt-10 flex items-center justify-center hover:bg-opacity-80 transition duration-300">
            {resetLoading ? 'Sending...' : 'Send Verification'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Login;
