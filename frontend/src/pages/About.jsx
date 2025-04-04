import React, { useContext } from 'react'
import { FaArrowTrendUp } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { NavContext } from '../contexts/NavContext';

const About = () => {

  const { isActive } = useContext(NavContext);
  const navigate = useNavigate();

  return (
    <div className={`h-full w-full flex flex-col items-center justify-start px-6 py-4 pt-[85px] md:p-4 gap-2 md:gap-4 ${isActive ? 'md:pl-[20%]' : ''}`}>
      <p>March 27, 2025</p>
      <h1 className='font-bold mt-3 mb-3 md:text-3xl md:mt-6 md:mb-6'>Introducing Questionable</h1>

      <button
        className='flex items-center justify-center gap-2 bg-grey-100 px-6 py-3 rounded-full hover:bg-grey-600 hover:text-grey-50 hover:border-none'
        onClick={() => navigate('/home')}
      >Generate Questions<FaArrowTrendUp className='hover:text-grey-50' /></button>

      <h2 className='text-left'>Questionable – AI-Powered Smart Exam Question Paper Generator</h2>
      <p className={`text-start w-full md:w-3/5 text-grey-100 ${isActive ? 'md:w-4/5' : ''}`}>Questionable is an innovative AI-powered Smart Exam Question Paper Generator designed to revolutionize how educational institutions create question papers. It leverages AI-based automation to generate high-quality, structured question papers based on input topics, difficulty levels, and question types.</p>

      <p className={`text-start w-full md:w-3/5 text-grey-100 ${isActive ? 'md:w-4/5' : ''}`}>Questionable offers a range of powerful features designed to streamline the exam paper generation process.</p>

      <p className={`text-start w-full md:w-3/5 text-grey-100 ${isActive ? 'md:w-4/5' : ''}`}>It leverages the Google Gemini API to generate diverse and well-structured questions, ensuring high-quality assessments.</p>

      <p className={`text-start w-full md:w-3/5 text-grey-100 ${isActive ? 'md:w-4/5' : ''}`}>Users can customize the difficulty level by selecting between Easy, Medium, and Hard, tailoring the exam to different proficiency levels. The platform supports multiple question types, including MCQs, short answers, long answers, and coding-based questions, making it suitable for various subjects and exam formats.</p>

      <p className={`text-start w-full md:w-3/5 text-grey-100 ${isActive ? 'md:w-4/5' : ''}`}>Additionally, it allows for subject-based generation, enabling users to input specific topics and receive AI-generated questions relevant to their needs.</p>

      <p className={`text-start w-full md:w-3/5 text-grey-100 ${isActive ? 'md:w-4/5' : ''}`}>A unique date-wise hisaab management system ensures that previously generated question papers are securely stored and easily accessible for future use. Lastly, the PDF export feature converts generated question papers into print-ready PDFs, simplifying distribution and printing for educators.</p>
    </div>
  )
}

export default About