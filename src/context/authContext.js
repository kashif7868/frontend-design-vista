import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import defaultUserPicture from "../assets/images/default-user.png";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));
  const [role, setRole] = useState(user?.role || null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/auth/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { user, tokens } = response.data;
        setUser(user);
        setAccessToken(tokens.access.token);
        setRefreshToken(tokens.refresh.token);
        setRole(user.role);

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", tokens.access.token);
        localStorage.setItem("refreshToken", tokens.refresh.token);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        clearTokens();
      }
    };

    if (!user && accessToken) {
      fetchUserData();
    }
  }, [user, accessToken]);

  const saveTokens = (tokens) => {
    setAccessToken(tokens.access.token);
    setRefreshToken(tokens.refresh.token);

    localStorage.setItem("accessToken", tokens.access.token);
    localStorage.setItem("refreshToken", tokens.refresh.token);
  };

  const clearTokens = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setRole(null);
    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const signUp = async (userData) => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth", userData);

      const { user: newUser, tokens } = response.data;

      setUser(newUser);
      saveTokens(tokens);
      setRole(newUser.role);

      localStorage.setItem("user", JSON.stringify(newUser));

      navigate("/");

      Swal.fire({
        icon: "success",
        title: "Signed Up",
        text: "You have successfully signed up!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Signup Error",
        text: error.response.data.message || "Signup failed",
      });
    }
  };

  const login = async ({ email, password }) => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      const { user, tokens } = response.data;

      if (!user.profilePicture) {
        user.profilePicture = defaultUserPicture;
      }

      setUser(user);
      saveTokens(tokens);
      setRole(user.role);

      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");

      Swal.fire({
        icon: "success",
        title: "Logged In",
        text: "You have successfully logged in!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Error",
        text: error.response.data.message || "Login failed",
      });
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        { refreshToken: refreshToken || "" }, // Ensure refreshToken is a string
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      clearTokens();

      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have successfully logged out!",
      });

      navigate("/login_signup");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Logout Error",
        text: error.response.data.message || "Logout failed",
      });
    }
  };

  const deleteAccount = async () => {
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Delete Account Error",
        text: "No user is currently logged in.",
      });
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/auth/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      clearTokens();

      Swal.fire({
        icon: "success",
        title: "Account Deleted",
        text: "Your account has been successfully deleted.",
      });

      navigate("/login_signup");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete Account Error",
        text: error.response.data.message || "Failed to delete account",
      });
    }
  };

  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signUp,
        logout,
        isAuthenticated,
        deleteAccount,
        accessToken,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
