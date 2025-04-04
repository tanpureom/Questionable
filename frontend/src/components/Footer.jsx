import React, { useState } from 'react';
import { FaCircleArrowUp } from "react-icons/fa6";
import { handleError } from './Toast';
import axios from 'axios';

const Footer = ({ prompt, setPrompt, handlePrompt }) => {

  const storePromptInDatabase = async (responseText) => {
    const username = localStorage.getItem('user');

    if (!prompt || !responseText || !username) {
      console.log(prompt);
      console.log(responseText);
      console.log(username);
      return;
    }

    try {
      const data = { prompt, responseText, username };

      const res = await axios.post('http://localhost:3000/generateprompt', data);

      if (res.data.success) {
        console.log('Prompt saved successfully:', res.data.message);
        // handleSuccess("Prompt saved successfully!");
      } else {
        handleError("Failed to save prompt..!!!");
      }
    } catch (error) {
      console.error('Error while storing prompt:', error?.response?.data?.message || error.message);
      handleError("Error while storing prompt!");
    }
  };

  const handleSubmit = async () => {
    try {
      const generatedResponse = await handlePrompt();
      if (!generatedResponse) {
        handleError("No response generated!");
        return;
      }
      await storePromptInDatabase(generatedResponse);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  return (
    <div className='absolute bottom-0 left-0 w-full h-fit p-6 z-49 flex flex-col gap-2 md:items-center '>
      <div className='prompt relative w-full h-fit flex items-center justify-center'>
        <input
          type="text"
          className='bg-grey-100 w-full focus:outline-none text-grey-600 rounded-md py-4 pr-11 placeholder:text-sm font-normal'
          placeholder='Ask anything... '
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              await handleSubmit();
            }
          }}
        />
        <FaCircleArrowUp
          size={25}
          className='absolute right-3 hover:cursor-pointer hover:text-grey-700'
          onClick={async () => {
            await handleSubmit();
          }}
        />
      </div>

      <p className='text-[13px] text-center text-grey-600'>Questionable can make mistakes. Check important info.</p>
    </div>
  );
}

export default Footer;
