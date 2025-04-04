import React, { useContext, useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';

const Login = () => {

  const { handleAuthLogin } = useContext(AuthContext);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPasswd, setLoginPasswd] = useState('');

  const navigate = useNavigate();

  const goToRegister = () => {
    navigate('/register');
  }

  const handleLogin = () => {

    const LoginCredentials = { username: loginEmail, password: loginPasswd };

    const result = handleAuthLogin(LoginCredentials);

    if(result) {
      setTimeout(() => {
        navigate('/home');
      }, 1800);
    }
    else {
      navigate('/login');
    }

  }

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center p-6'>
      <div className="login w-full h-fit p-6 bg-grey-50 flex flex-col items-center justify-center gap-6 rounded-sm md:w-1/4">
        <h1 className='text-center font-medium'>Login into account</h1>
        <p className='text-grey-500 text-center md:text-sm'>Enter your email below to Login your account</p>

        <input
          type="text"
          placeholder='name@example.com'
          className='border-solid border-[1px] border-grey-300 w-full rounded-sm md:text-sm'
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder='Password'
          className='border-solid border-[1px] border-grey-300 w-full rounded-sm md:text-sm'
          value={loginPasswd}
          onChange={(e) => setLoginPasswd(e.target.value)}
        />

        <button
          className='bg-grey-950 text-grey-50 w-full px-4 py-2 rounded-sm md:text-sm'
          onClick={handleLogin}
        >Sign In with Email</button>

        <p className='text-grey-400 md:text-sm'>or continue with</p>

        <button className='border-solid border-[1px] border-grey-300 w-full rounded-sm px-4 py-2 flex items-center justify-center gap-2 md:text-sm'> <FcGoogle size={20} /> Sign in with Google</button>

        <p
          className='text-grey-500 hover:cursor-pointer md:text-sm'
          onClick={goToRegister}
        >Register here...</p>

        <p
          className='text-grey-500 hover:cursor-pointer md:text-sm'
        >Forgot password?</p>
      </div>
    </div>
  )
}

export default Login