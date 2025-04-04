import React, { useContext } from 'react';
import { CgMenuLeft } from "react-icons/cg";
import { NavContext } from '../contexts/NavContext.jsx';
import { AuthContext } from '../contexts/AuthContext.jsx'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SideNavbar from './sidenavbars/SideNavbar.jsx';
import { AdminContext } from '../contexts/AdminContext.jsx';

const Navbar = () => {

  const { isActive, handleMenuButton } = useContext(NavContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  const { adminIsAuthenticated } = useContext(AdminContext);
  const Navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    Navigate('/');
  }

  return (
    <>
      {/* Navbar */}
      <div className='w-full h-[80px] md:h-[60px] bg-white fixed top-0 left-0 z-20 py-0 px-6 flex items-center justify-between'>
        <div className='w-1/3 flex h-full items-center justify-start'>
          <CgMenuLeft
            size={23}
            className='hover:cursor-pointer hover:text-grey-700'
            onClick={handleMenuButton}
          />
        </div>

        <div className='w-1/3 flex h-full items-center justify-center'>
          <h2
            className='text-grey-950 hover:cursor-pointer'
            onClick={() => Navigate('/')}
          >Questionable</h2>
        </div>

        <div className='w-1/3 flex h-full items-center justify-end'>

          {
            (location.pathname == '/home') && (
              <div className='hidden md:flex md:gap-10 md:mr-10'>
                <Link
                  to='/'
                  className='text-[16px] text-grey-800 hover:text-grey-600'
                >Home</Link>

                <Link
                  to='/papers'
                  className='text-[16px] text-grey-800 hover:text-grey-600'
                >Question Papers</Link>

                <Link
                  to='/login'
                  className='text-[16px] text-grey-800 hover:text-grey-600'
                  onClick={handleLogout}
                >Logout</Link>
              </div>
            )
          }

          {isAuthenticated ? (
            <div className='h-7 w-7 md:h-8 md:w-8 bg-grey-800 rounded-full flex items-center justify-center hover:cursor-pointer'><h2 className='[color:white!important] [font-weight: 400!important]'>{(user && typeof user === 'string') ? user.toUpperCase().charAt(0) : 'Q'}</h2></div>
          ) : (
            <div className='flex items-center justify-center gap-2'>
              <button
                className="login hidden md:px-4 md:py-2 md:rounded-full md:flex bg-transparent text-grey-900"
                onClick={() => Navigate('/login')}
              >Login</button>
              <button
                className="signup hidden md:px-4 md:py-2 md:rounded-full md:flex bg-grey-800 text-white hover:border-[1px] hover:border-solid hover:border-grey-800 hover:text-grey-800 hover:bg-transparent"
                onClick={() => Navigate('/register')}
              >Register</button>
            </div>
          )}
        </div>
      </div>


      {
        isActive && (
          <SideNavbar handleLogout={handleLogout} />
        )
      }
    </>
  );
};

export default Navbar;
