import React, { useEffect, useState } from 'react'
import { handleError, handleSuccess } from '../Toast.jsx'
import axios from 'axios';

const QuestionPageNav = () => {

  const [questions, setQuestions] = useState('');
  const [filename, setFilename] = useState('');


  useEffect(() => {
    const savedQuestions = localStorage.getItem('questions');
    const savedFilename = localStorage.getItem('filename');

    if (savedQuestions) {
      setQuestions(savedQuestions);
    }

    if (savedFilename) {
      setFilename(savedFilename);
    }

  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setQuestions(newValue);
    localStorage.setItem('questions', newValue);
  };

  const handleFilenameChange = (e) => {
    const newValue = e.target.value;
    setFilename(newValue);
    localStorage.setItem('filename', newValue);
  }

  const handleGenerateQuestions = async () => {
    if (!filename || !questions) {
      // alert('Please enter both the filename and the questions.');
      handleError('Please enter both filename and questions..!!!');
      return;
    }

    const username = localStorage.getItem('user'); // Assuming username is stored
    if (!username) {
      // alert('User not authenticated. Please login again.');
      handleError("User not authenticated..!!!");
      return;
    }

    const requestData = {
      filename,
      questions,
      username,
    };

    try {
      const response = await axios.post('http://localhost:3000/generatequestions', requestData, {
        responseType: 'blob',
      });

      if (response.status === 200) {
        // Create a URL for the blob
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Create a download link
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${filename}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Show success message
        handleSuccess("PDF generated and downloaded successfully..!!!");

        // Clear data
        setQuestions('');
        setFilename('');
        localStorage.removeItem('questions');
        localStorage.removeItem('filename');
      } else {
        handleError(response.data.message);
      }
    } catch (error) {
      // console.error('Error while sending data to the backend:', error);
      if (error.response) {
        // alert(error.response.data.message || 'Server responded with an error.');
        handleError(error.response.data.message);
      } else {
        // alert('Failed to connect to the server.');
        handleError('Failed to connect to the server.');
      }
    }
  };

  return (
    <div className="w-full h-full bg-grey-100 z-50 p-4 flex flex-col gap-2 border-r border-grey-200 md:h-full">
      <input
        type="text"
        className='bg-white border-solid border-grey-400 border-[1px] rounded-sm focus:outline-none placeholder:font-light'
        placeholder='Filename without ext. here..!!!'
        value={filename}
        onChange={handleFilenameChange}
      />
      <textarea
        id='question-generator-textarea'
        className='bg-white w-full h-[70%] p-2 focus:outline-none border border-grey-400 rounded-sm resize-none text-grey-800 placeholder:font-light'
        placeholder='Copy and paste questions here..!!!'
        value={questions}
        onChange={handleChange}
      ></textarea>

      <button
        className='bg-grey-700 text-grey-50 px-4 py-2 rounded-sm text-wrap hover:bg-grey-800 hover:cursor-pointer'
        onClick={handleGenerateQuestions}
      >
        Generate
      </button>

      <p className='text-[14px] text-grey-400 md:text-[12px]'>
        Copy & Paste the questions in the above field to generate the question paper.
      </p>
    </div>
  )
}

export default QuestionPageNav