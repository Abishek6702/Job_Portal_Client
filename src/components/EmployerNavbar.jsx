import React, { useEffect, useState } from "react";
import { Bell, ChevronDown, HelpCircle, Mail, User } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logomain.svg";

const EmployerNavbar = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstTimeLogin, setFirstTimeLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setEmail(decoded.email || "User");
        setFirstTimeLogin(decoded.firstTimeLogin || false);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);
  const handleProfileClick = () => {
    if (!firstTimeLogin) {
      navigate("/employer-dashboard/employer-profile");
    } else {
      alert("Complete Your Company Profile");
    }
  };

  return (
    <nav className="w-full flex justify-between items-center p-4 bg-white drop-shadow-sm">
      <div className="   ">
        <img src={logo} alt="Job Portal" className="h-6 md:h-6" />
      </div>
      <div className="flex items-center gap-6 text-gray-600 text-sm md:text-base">
        <div className="hidden md:flex items-center gap-1 cursor-pointer">
          <HelpCircle size={18} />
          <span className="hidden sm:inline">Help</span>
        </div>
        <div className="flex  items-center gap-1 cursor-pointer">
          <Bell size={18} />
          <span className="hidden sm:inline">Notifications</span>
        </div>
        <div className="hidden md:flex  items-center gap-1 cursor-pointer">
          <Mail size={18} />
          <span className="hidden sm:inline">Messages</span>
        </div>
        <div
          className=" profile_container flex items-center gap-2 "
          onClick={handleProfileClick}
        >
          <div className="flex items-center cursor-pointer border-l pl-4 ">
            <User size={18} />
            <span className="text-xs md:text-sm truncate max-w-[100px]">
              {email}
            </span>
             <ChevronDown />
          </div>
         
        </div>
      </div>
    </nav>
  );
};

export default EmployerNavbar;
