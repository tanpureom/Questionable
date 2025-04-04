import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import axios from "axios";

const AuthRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setUser(localStorage.getItem('user'));

    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    const verifyToken = async (token) => {
      try {
        const url = 'http://localhost:3000/verifytoken';

        const response = await axios.post(
          url,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { message, success } = response.data;
        console.log(message);
        console.log(success);

        if (success) {
          setIsAuthenticated(true);
          if (location.pathname === '/login' || location.pathname === '/register') {
            navigate('/home');
          }
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (error.response) {
          console.log(error.response.data);
          return error.response.data;
        } else if (error.request) {
          return { error: 'No response from server.' };
        } else {
          return { error: error.message };
        }
      }
    };

    verifyToken(token);
  }, [location, navigate, setIsAuthenticated]);

  return null; // No UI needed
};

export default AuthRoutes;
