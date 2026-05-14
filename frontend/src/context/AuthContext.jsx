import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Configure Axios Defaults
axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Check if we have a Google OAuth token in the URL
        const params = new URLSearchParams(window.location.search);
        const googleToken = params.get("token");

        if (googleToken) {
          // Save token and set auth header
          localStorage.setItem("token", googleToken);
          axios.defaults.headers.common["Authorization"] = `Bearer ${googleToken}`;

          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Restore token from localStorage if available
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }

        // Fetch CSRF token
        try {
          const csrfRes = await axios.get("/auth/csrf-token");
          axios.defaults.headers.common["X-CSRF-Token"] = csrfRes.data.csrfToken;
        } catch (csrfErr) {
          console.error("CSRF Fetch Error:", csrfErr);
        }

        // Check if user is authenticated
        const res = await axios.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post("/auth/login", { email, password });

    // Store token for Authorization header
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    }

    setUser(res.data.user);
    return res.data;
  };

  const signup = async (userData) => {
    const res = await axios.post("/auth/signup", userData);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    }

    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (err) {
      // Logout anyway even if API fails
    }
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
