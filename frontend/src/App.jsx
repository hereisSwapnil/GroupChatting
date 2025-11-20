import LandingPage from "./pages/LandingPage";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Chats from "./pages/Chats";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userAtom } from "./recoil/atom/userAtom";
import axios from "axios";
import { io } from "socket.io-client";


const socket = io(import.meta.env.VITE_BASE_API_SOCKET, {
  withCredentials: true,
  autoConnect: true,
  transports: ["websocket", "polling"],
});

// Expose socket for debugging
window.socket = socket;

function App() {
  const [user, setUser] = useRecoilState(userAtom);
  const location = useLocation();

  // Fetch user data whenever we navigate to /chats or /chat
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Only fetch user if we have a token and we're on a protected route
    if (token && (location.pathname === "/chats" || location.pathname === "/chat")) {
      axios
        .get(`${import.meta.env.VITE_BASE_API}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("User data fetched:", response.data);
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          // Clear user data if token is invalid
          setUser(null);
          localStorage.removeItem("token");
        });
    } else if (!token) {
      // Clear user data if no token
      setUser(null);
    }
  }, [location.pathname, setUser]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chats" element={<Chats socket={socket} />} />
        <Route path="/chat" element={<Chats socket={socket} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
