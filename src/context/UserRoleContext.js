import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const UserRoleContext = createContext();

// Custom hook to use the UserRoleContext
export const useUserRole = () => useContext(UserRoleContext);

// Provider component
export const UserRoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Assume userRole is fetched from API or auth provider
    // For now, we can set it manually
    const fetchedUserRole = localStorage.getItem('userRole'); // or fetch from API
    setUserRole(fetchedUserRole);
  }, []);

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};
