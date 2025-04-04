import { createContext, useState } from "react";
import { handleError } from "../components/Toast";
import axios from "axios";

export const AdminContext = createContext();


export const AdminContextProvider = ({ children }) => {

  const [admin, setAdmin] = useState({});
   const [adminIsAuthenticated, setAdminIsAuthenticated] = useState(false);

  const handleAdminLogin = async (LoginCredentials) => {
    const { username, password } = LoginCredentials;
    console.log(username, password);

    if (!username || !password) {
      return res.status(400).json({
        message: "Enter username and password..!!!",
        success: false
      })
    }

    try {
      const response = await axios.post('http://localhost:3000/adminlogin', { username, password });

      console.log(response.data);

      const { success, message, token, data } = response.data;

      if (success) {
        handleSuccess(message);
        setAdmin(admin);
        setAdminIsAuthenticated(true);
        localStorage.setItem('admin', data.username);
        localStorage.setItem('adminToken', token);
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


  const handleAdminRegister = async (newRegisteredUser) => {
    const { username, password } = newRegisteredUser;

    if (!username || !password) {
      handleError("All fields are required..!!!");
    }

    try {
      const url = 'http://localhost:3000/adminregister';
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
  }


  return (
    <AdminContext.Provider value={{handleAdminRegister, handleAdminLogin, adminIsAuthenticated}}>
      {children}
    </AdminContext.Provider>
  )
}