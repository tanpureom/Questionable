import { createContext, useState } from "react";
import { handleError, handleSuccess } from '../components/Toast.jsx';
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chat, setChat] = useState([]);
  // const navigate = useNavigate();

  const handleNewRegister = async (newRegisteredUser) => {
    const { username, password } = newRegisteredUser;

    if (!username || !password) {
      return handleError("Username and password is required..!!!");
    }

    try {
      const url = 'http://localhost:3000/register';
      const response = await axios.post(url, { username, password });

      // console.log(response);

      const { message, success } = response.data;
      // console.log(message);
      // console.log(success);

      if (success) {
        handleSuccess(message);
        return true;
      }

    } catch (error) {
      // console.log(error.response.data);
      if (error.response) {
        const { message } = error.response.data;
        handleError(message);
        return false;
      } else if (error.request) {
        handleError("Something went wrong..!!!");
        return false;
        // console.log("No response from the server.");
      } else {
        handleError(error.message);
        return false;
        // console.log("Error:", error.message);
      }
    }
  };

  const handleAuthLogin = async (LoginCredentials) => {
    const { username, password } = LoginCredentials;

    if (!username || !password) {
      handleError("Enter Username and Password..!!!");
    }

    try {
      const url = 'http://localhost:3000/login';

      const response = await axios.post(url, { username, password });

      console.log(response);

      const { message, user, token, success } = response.data;

      if (success) {
        handleSuccess(message);
        setUser(username);
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
        localStorage.setItem('user', user);
        console.log(token);
        return true;
      }

    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;
        handleError(message);
        return false;
      } else if (error.request) {
        handleError("Something went wrong..!!!");
        return false;
        // console.log("No response from the server.");
      } else {
        handleError(error.message);
        return false;
        // console.log("Error:", error.message);
      }
    }

  }


  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, handleNewRegister, handleAuthLogin, chat, setChat }}>
      {children}
    </AuthContext.Provider>
  )
}
