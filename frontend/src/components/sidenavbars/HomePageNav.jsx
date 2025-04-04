import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

const HomePageNav = ({ handleLogout }) => {

  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="sidenavabar w-4/5 h-[calc(100vh-80px)] bg-white fixed top-[80px] left-0 z-50 flex flex-col gap-2 border-r border-grey-100 md:border-none md:w-1/5 md:top-[60px] md:h-[calc(100vh-60px)]">
      {
        isAuthenticated ? (
          <>
            <Link
              to="/home"
              className='text-grey-950 w-full py-3 px-6 hover:bg-grey-600 hover:text-grey-50 rounded-tr-md rounded-br-md bg-grey-100'
            >Generate Questions</Link>

            <Link
              to="/papers"
              className='text-grey-950 w-full py-3 px-6 hover:bg-grey-600 hover:text-grey-50 rounded-tr-md rounded-br-md bg-grey-100'
            >Question Papers</Link>

            <Link
              to="/login"
              className='text-grey-950 w-full py-3 px-6 hover:bg-grey-600 hover:text-grey-50 rounded-tr-md rounded-br-md bg-grey-100'
              onClick={handleLogout}
            >Logout</Link>
          </>
        ) : (
          <p className='pl-6 pt-4'>Please Login to access the Questionable..!!!</p>
        )
      }
    </div>
  )
}

export default HomePageNav