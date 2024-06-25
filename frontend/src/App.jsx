import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chats from "./pages/Chats";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { userAtom } from "./recoil/atom/userAtom";
import axios from "axios";

function App() {
  const [user, setUser] = useRecoilState(userAtom);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_API}/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
