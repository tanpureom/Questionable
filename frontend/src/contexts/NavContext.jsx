import { Children, createContext, useState } from "react";

export const NavContext = createContext();

export const NavContextProvider = ({ children }) => {

  const [isActive, setIsActive] = useState(false);

  const handleMenuButton = () => {
    setIsActive(!isActive);
  };

  return (
    <NavContext.Provider value={{ isActive, setIsActive, handleMenuButton }}>
      {children}
    </NavContext.Provider>
  )
}