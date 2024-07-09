import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const useNavigationLoader = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const routesWithLoader = [
      "/",
      "/design_vista",
      "/hiredesigner",
      "/edit-designer-profile",
      "/designer-profile",
      "/edit-hire-designer-profile",
      "/hire-designer-profile",
      "/login_signUp",
      "/setting",
      "/help",
    ];

    if (routesWithLoader.includes(location.pathname)) {
      setLoading(true);
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 800);

      return () => clearTimeout(timeoutId);
    } else {
      setLoading(false);
    }
  }, [location]);

  return loading;
};

export default useNavigationLoader;
