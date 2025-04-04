import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom';
import HomePageNav from './HomePageNav.jsx';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import HistoryPageNav from './HistoryPageNav.jsx';
import QuestionPageNav from './QuestionPageNav.jsx';

const SideNavbar = ({ handleLogout }) => {

  const Navigate = useNavigate();
  const location = useLocation();
  const [prompts, setPrompts] = useState([]);
  const [activeTab, setActiveTab] = useState('prompts');
  const { chat } = useContext(AuthContext);
  const { isAuthenticated } = useContext(AuthContext);

  const handlePromptHistoryData = async () => {

    const username = localStorage.getItem('user');

    if (!username) {
      console.log("Username is empty..!!!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/home/prompts', { username });

      if (response.data.success) {
        console.log('Prompts fetched successfully:', response.data.promptArray);
        return response.data.promptArray;
      } else {
        console.log(response.data.message);
        return [];
      }
    } catch (error) {
      console.error('Error while fetching prompt history:', error?.response?.data?.message || error.message);
      return [];
    }
  };

  // const handleAdminLogout = () => {
  //   localStorage.removeItem('admin');
  //   localStorage.removeItem('adminToken');
  //   Navigate('/adminlogin');
  // }

  useEffect(() => {
    const fetchData = async () => {
      const data = await handlePromptHistoryData();
      setPrompts(data);
    };

    fetchData();
  }, [chat]);

  return (
    <div className='w-4/5 h-[calc(100vh-80px)] fixed top-[80px] left-0 z-50 flex flex-col gap-2 md:border-r-[1px] md:border-grey-200 md:border-solid md:w-1/5 md:top-[60px] md:h-[calc(100vh-60px)]'>

      {/* Homepage Navbar */}
      {
        (location.pathname == '/' || location.pathname == '/papers') && (
          <HomePageNav handleLogout={handleLogout} />
        )
      }

      {/* QuestionGenerator Navbar */}
      {
        (location.pathname == '/home') && (
          <div className='h-full w-full'>
            <div className='w-full p-6 pt-4 pb-4 flex items-center justify-start gap-6 z-50'>
              <Link
                className={`text-grey-950 ${activeTab === 'prompts' ? 'font-bold' : ''}`}
                onClick={() => setActiveTab('prompts')}
              >Prompts</Link>

              <Link
                className={`text-grey-950 ${activeTab === 'questions' ? 'font-bold' : ''}`}
                onClick={() => setActiveTab('questions')}
              >Question Papers</Link>
            </div>
            <div className='h-full w-full scrollbar-none overflow-y-auto overflow-hidden'>
              {/* Dynamic Rendering of homepage sidebar */}
              {activeTab === 'prompts' && (<HistoryPageNav prompts={prompts} />)}
              {activeTab === 'questions' && (<QuestionPageNav />)}
            </div>
          </div>
        )
      }


    </div>
  )
}

export default SideNavbar