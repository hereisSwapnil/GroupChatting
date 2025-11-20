import React from "react";
import { useRecoilValue } from "recoil";
import { userAtom } from "../recoil/atom/userAtom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { X, LogOut, Mail, User } from "lucide-react";

const EditProfile = ({ setEditingProfile }) => {
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logged out successfully");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm p-4">
      <div className="glass-card w-full max-w-md p-8 rounded-2xl relative animate-fade-in flex flex-col items-center gap-6">
        <button
          onClick={() => setEditingProfile(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-primary to-accent">
            <img
              src={user.profilePic}
              alt={user.name}
              className="w-full h-full rounded-full object-cover border-4 border-dark-card"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-dark-card"></div>
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
          <p className="text-gray-400 text-sm">Active now</p>
        </div>

        <div className="w-full space-y-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center gap-4">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Full Name</p>
              <p className="text-white font-medium">{user.name}</p>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center gap-4">
            <div className="p-2 bg-accent/20 rounded-lg text-accent">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Email Address</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border border-red-500/20"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
