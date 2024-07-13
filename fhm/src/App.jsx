import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Login from './Auth/Login';
import Register from './Auth/Register';
import AdminRoutes from './Admin/AdminRoutes';
import StaffRoutes from './Staff/StaffRoutes';
import WaitingList from './components/WaitingList';
import Loader from './components/Loader';
import './App.css';

const App = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={300}>
        <Routes location={location}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/staff/*" element={<StaffRoutes />} />
          <Route path="/waiting" element={<WaitingList />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

const AppWrapper = () => (
  <Router>
    <Routes>
      <Route path="/*" element={<App />} />
    </Routes>
  </Router>
);

export default AppWrapper;
