import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import About from './About.jsx';
import Navbar from '../components/Navbar.jsx';
import Home from './Home.jsx';
import Login from '../components/Login.jsx';
import Register from '../components/Register.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthRoutes from '../components/AuthRoutes.jsx';
import Papers from './Papers.jsx'
import Admin from './Admin.jsx';
import AdminLogin from '../components/AdminLogin.jsx';
import AdminRegister from '../components/AdminRegister.jsx'
import AdminNavbar from '../components/AdminNavbar.jsx';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
};

const PrivateAdminRoute = ({children}) => {
  const adminToken = localStorage.getItem('adminToken');
  return adminToken ? children : <Navigate to="/admin/login"/>
}

const App = () => {
  return (
    <>
      <BrowserRouter>
        {/* Ensure AuthRoutes runs on every route change */}
        <AuthRoutes />
        <Routes>
          <Route path="/" element={<><Navbar /><About /></>} />
          <Route path="/home" element={<PrivateRoute><Navbar /><Home /></PrivateRoute>} />
          <Route path="/papers" element={<PrivateRoute><Navbar /><Papers /></PrivateRoute>} />
          {/* <Route path="/admin/home" element={<PrivateAdminRoute><AdminNavbar /><Admin /></PrivateAdminRoute>} /> */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/adminlogin" element={<AdminLogin />} /> */}
          <Route path="/register" element={<Register />} />
          {/* <Route path="/adminregister" element={<AdminRegister />} /> */}
        </Routes>
      </BrowserRouter>

      {/* Toast Container */}
      <ToastContainer
        toastClassName={() =>
          'relative flex max-w-[75%] items-start justify-start p-6 text-grey-800 shadow-lg text-wrap z-50 md:text-[14px] bg-white'}
      />
    </>
  );
};

export default App;
