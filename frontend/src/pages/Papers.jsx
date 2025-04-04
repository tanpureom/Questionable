import React, { useContext, useEffect, useState, useRef } from 'react';
import { NavContext } from '../contexts/NavContext';
import axios from 'axios';
import { FiMoreVertical } from "react-icons/fi";
import { handleError, handleSuccess } from '../components/Toast';

const Papers = () => {
  const { isActive } = useContext(NavContext);
  const [questionPapers, setQuestionPapers] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRefs = useRef([]);
  const [mousePosition, setMousePosition] = useState({ clientX: 0, clientY: 0 });

  const fetchAllQuestionPapers = async () => {
    try {
      const username = localStorage.getItem('user');

      if (!username) {
        console.log("Username not found");
        return;
      }

      const response = await axios.post('http://localhost:3000/papers', { username });

      if (response.data.success) {
        console.log(response.data.data);
        setQuestionPapers(response.data.data);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching question papers:', error);
    }
  };

  useEffect(() => {
    fetchAllQuestionPapers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenuIndex !== null && menuRefs.current[openMenuIndex] && !menuRefs.current[openMenuIndex].contains(e.target)) {
        setOpenMenuIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuIndex]);

  const handleDownload = async (FileID) => {
    try {
      console.log("Downloading File with ID:", FileID);
      
      // Make a GET request for file download
      const response = await axios.get(`http://localhost:3000/downloadquestionpaper/${FileID}`, {
        responseType: 'blob' // Important for handling binary data
      });
  
      // Create a URL for the file blob
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
  
      // Create a temporary link to download the file
      const a = document.createElement('a');
      a.href = url;
      a.download = `${FileID}.pdf`; // Adjust filename if necessary
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setOpenMenuIndex(null);
  
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  
  const handleDelete = async (FileId) => {
    console.log("Deleting File with ID:", FileId);

    try {
      const response = await axios.post("http://localhost:3000/deletequetionpaper", { FileId });

      if (response.data.success) {
        console.log(response.data.message);

        // Remove the deleted paper from frontend UI
        setQuestionPapers((prev) => prev.filter((paper) => paper._id !== FileId));
        setOpenMenuIndex(null);
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting question paper:", error.message);
    }
  };

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  return (
    <div className={`w-full h-[calc(100vh-80px)] md:h-[calc(100vh-60px)] ${isActive ? 'md:pl-[20%]' : 'md:pl-0'} absolute top-[80px] md:top-[60px] flex justify-center md:grid-cols-4`}>

      <div className={`w-full h-full gap-8 md:w-3/5 ${isActive && `md:w-4/5`} overflow-auto grid grid-cols-2 grid-rows-4 md:grid-rows-5 md:grid-cols-5 py-6 md:py-12`}>

        {questionPapers.length === 0 ? (
          <p className="col-span-4 text-center text-gray-700">No Question Papers Found</p>
        ) : (
          questionPapers.map((paper, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 w-full h-fit p-2">
              {/* File Box */}
              <div className="flex items-center justify-center w-3/5 aspect-[4/3] bg-gradient-to-br from-gray-600 to-gray-700 shadow-lg rounded-lg transform hover:scale-105 transition duration-300 ease-in-out">
                <span className="text-white text-xl font-bold">{paper.filename.charAt(0).toUpperCase()}</span>
              </div>

              {/* File Name and Menu */}
              <div className="flex items-center justify-between w-3/5 pl-2 pr-1" ref={(el) => (menuRefs.current[index] = el)}>
                <p className="text-gray-800 text-[14px] font-semibold truncate">{paper.filename}</p>

                <div className='relative'>
                  <button onClick={() => toggleMenu(index)} className="text-gray-600 hover:text-gray-800">
                    <FiMoreVertical size={15} />
                  </button>

                  {/* Toggle component */}
                  {openMenuIndex === index && (
                    <div className={`w-fit rounded-md h-fit p-3 bg-white flex flex-col items-start justify-start hover:cursor-pointer absolute top-${mousePosition.clientX} right-${mousePosition.clientY} z-50 shadow-xl`}>
                      <p
                        onClick={() => handleDownload(paper._id)}
                        className='p-3 hover:bg-gray-200 w-full rounded-md text-[14px]'
                      >Download</p>

                      <p
                        onClick={(e) => {
                          handleDelete(paper._id);
                          setMousePosition({ clientX: e.clientX, clientY: e.clientY });
                          console.log(e.clientX, e.clientY);
                        }} className='p-3 hover:bg-gray-200 w-full rounded-md text-[14px] font-semibold text-red-500'
                      >Delete</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Papers;
