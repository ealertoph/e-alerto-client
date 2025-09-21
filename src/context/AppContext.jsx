import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // ✅ Corrected: Initial state is null, not false
  const [isLoading, setIsLoading] = useState(true); // ✅ This is correct

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth");
      if (data.success) {
        setIsLoggedIn(true);
        // ⭐ Fetch user data immediately after successful authentication
        await getUserData();
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      setIsLoggedIn(false);
      setUserData(null);
    } finally {
      setIsLoading(false); // ✅ Final loading state update after all checks are done
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");
      if (data.success) {
        // ⭐ IMPORTANT: Ensure your backend's /api/user/data route returns an object
        // with the _id and other user details.
        // Example response: { success: true, userData: { _id: '...', username: '...' } }
        setUserData(data.userData);
      } else {
        toast.error(data.message);
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(null);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    isLoading,
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};
