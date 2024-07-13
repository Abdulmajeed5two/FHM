import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'material-design-iconic-font/dist/css/material-design-iconic-font.min.css';
import gsap from 'gsap';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    gender: '',
    role: '',
    password: ''
  });

  const registerRef = useRef(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    gsap.fromTo(registerRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5200/auth/register', formData);
      toast.success('User registered. Waiting for approval.');
      setTimeout(() => {
        navigate('/login'); 
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div ref={registerRef} className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center" style={{ backgroundImage: "url('src/assets/Auth/bgr.jpg')" }}>
      <ToastContainer />
      <div className="bg-white max-w-4xl mx-auto flex shadow-lg">
        <div className="w-1/2">
          <img src="src/assets/Auth/rr.jpg" alt="registration" className="w-full h-full object-cover" />
        </div>
        <form onSubmit={handleSubmit} className="w-1/2 p-10 flex flex-col justify-center">
          <h3 className="text-2xl font-semibold text-center mb-7 uppercase">Registration Form</h3>
          <div className="relative mb-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-black transition-colors duration-300"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <i className="zmdi zmdi-account absolute bottom-2 right-0 transition-transform duration-300 transform group-hover:scale-110"></i>
          </div>
          <div className="relative mb-6">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-black transition-colors duration-300"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <i className="zmdi zmdi-account absolute bottom-2 right-0 transition-transform duration-300 transform group-hover:scale-110"></i>
          </div>
          <div className="relative mb-6">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-black transition-colors duration-300"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <i className="zmdi zmdi-email absolute bottom-2 right-0 transition-transform duration-300 transform group-hover:scale-110"></i>
          </div>
          <div className="relative mb-6">
            <select
              name="gender"
              className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-black transition-colors duration-300"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <i className="absolute bottom-2 right-0 transition-transform duration-300 transform group-hover:scale-110" style={{ fontSize: '17px' }}></i>
          </div>
          <div className="relative mb-6">
            <select
              name="role"
              className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-black transition-colors duration-300"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Role</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
            <i className="absolute bottom-2 right-0 transition-transform duration-300 transform group-hover:scale-110" style={{ fontSize: '17px' }}></i>
          </div>
          <div className="relative mb-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border-b w-full h-10 text-sm px-0 focus:outline-none focus:border-black transition-colors duration-300"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <i className="zmdi zmdi-lock absolute bottom-2 right-0 transition-transform duration-300 transform group-hover:scale-110"></i>
          </div>
          <button type="submit" className="bg-black text-white w-40 h-12 mx-auto mt-10 flex items-center justify-center hover:bg-opacity-80 transition duration-300 group">
            Register
            <i className="zmdi zmdi-arrow-right ml-2 transition-transform duration-300 transform group-hover:translate-x-1"></i>
          </button>
          <div className="mt-10 text-center">
            <p>Already have an account?
              <Link to="/login" className="text-black underline ml-1">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
