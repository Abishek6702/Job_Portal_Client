import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ProfileSidebarTabs from "./ProfileSidebarTabs";
import AboutTab from "../components/tabs/AboutTab";
import EducationTab from "../components/tabs/EducationTab";
import ExperienceTab from "../components/tabs/ExperienceTab";
import SkillsTab from "../components/tabs/SkillsTab";
import ResumeTab from "../components/tabs/ResumeTab";
import { UserPlus, MessageCircle, Check, MoreVertical } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import MyPostsTab from "../components/tabs/MyPostsTab";

const TABS = ["About", "Education", "Experience", "Resumes", "Skills" ,"Posts"];

const UserPublicProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("About");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connect"); // "connect", "pending", "connected"
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Get logged-in user ID from JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id || decoded._id || decoded.userId);
      } catch (error) {
        setCurrentUserId(null);
      }
    }
  }, []);

  // Fetch profile
  useEffect(() => {
    if (!userId) return;
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  // Fetch connection status
  useEffect(() => {
    if (!currentUserId || !userId || currentUserId === userId) return;
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/${currentUserId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.connections?.includes(userId))
          setConnectionStatus("connected");
        else if (data.sentRequests?.includes(userId))
          setConnectionStatus("pending");
        else setConnectionStatus("connect");
      });
  }, [currentUserId, userId]);

  // Handle connect button
  const handleConnect = async () => {
    setConnectionStatus("pending");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/connections/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderId: currentUserId,
            receiverId: userId,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to send connection request");
    } catch (error) {
      setConnectionStatus("connect");
      alert("Failed to send connection request");
    }
  };

  // Handle remove connection
  const handleRemoveConnection = async () => {
    setMenuOpen(false);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/connections/unconnect`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId1: currentUserId,
            userId2: userId,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to remove connection");
      setConnectionStatus("connect");
    } catch (error) {
      alert("Failed to remove connection");
    }
  };

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-20">Loading profile...</div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-gray-500 py-20">Profile not found</div>
    );
  }

  const onboarding = profile.onboarding || {};
  const fullName = onboarding.firstName
    ? `${onboarding.firstName} ${onboarding.lastName}`
    : profile.name;
console.log(userId)
  // Render tab content just like your main profile
  const renderTabContent = () => {
    switch (activeTab) {
      case "About":
        return <AboutTab profile={profile} />;
      case "Education":
        return <EducationTab education={onboarding.education || []} />;
      case "Experience":
        return <ExperienceTab experience={onboarding.experience || []} />;
      case "Resumes":
        return <ResumeTab onboarding={profile.onboarding} />;
      case "Skills":
        return <SkillsTab onboarding={profile.onboarding} />;
       case "Posts":
        return <MyPostsTab userId={userId}  />;
      default:
        return null;
    }
    
  };

  // Show connect/message only if viewing someone else's profile
  const showActions = currentUserId && currentUserId !== userId;

  return (
    <>
      <div className="w-[80%] min-h-[90vh] m-auto mb-20 bg-white rounded-2xl mt-6 overflow-hidden border border-gray-300">
        {/* Banner */}
        <div className="relative h-40 bg-gray-100 rounded-t-2xl overflow-hidden">
          {onboarding.banner ? (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/${onboarding.banner}`}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No banner image</span>
            </div>
          )}
          {/* Menu icon in banner, top-right */}
          {showActions && connectionStatus === "connected" && (
            <div className="absolute top-2 right-2 z-30" ref={menuRef}>
              <button
                type="button"
                className="p-2 rounded-full bg-white border border-gray-200 shadow"
                onClick={e => {
                  e.stopPropagation();
                  setMenuOpen(open => !open);
                }}
              >
                <MoreVertical className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-45 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <button
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    onClick={handleRemoveConnection}
                  >
                    Remove Connection
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Profile Info */}
        <div className="flex justify-between items-center px-8 pt-4 pb-6">
          <div className="flex items-center">
            <div className="relative">
              <img
                src={
                  onboarding.profileImage
                    ? `${import.meta.env.VITE_API_BASE_URL}/${onboarding.profileImage}`
                    : "/default-avatar.png"
                }
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-white object-cover shadow -mt-14"
              />
            </div>
            <div className="ml-4">
              <p className="font-semibold text-xl">{fullName}</p>
              <p className="text-gray-500 mt-1">
                {onboarding.preferredRoles?.[0] || "Professional"}
              </p>
              <p className="text-blue-500 text-bold font-bold">
                {profile.connections.length} Connections
              </p>
            </div>
          </div>
          {/* Action Buttons */}
          {showActions && (
            <div className="flex gap-2">
              {connectionStatus === "connect" && (
                <button
                  onClick={handleConnect}
                  className="bg-blue-600 text-white px-5 py-1.5 rounded-full font-medium flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  <UserPlus size={18} />
                  Connect
                </button>
              )}
              {connectionStatus === "pending" && (
                <button
                  disabled
                  className="bg-yellow-100 text-yellow-700 px-5 py-1.5 rounded-full font-medium flex items-center gap-2"
                >
                  <Check size={18} /> Pending
                </button>
              )}
              {connectionStatus === "connected" && (
                <button className="border border-blue-600 text-blue-600 px-5 py-1.5 rounded-full font-medium flex items-center gap-2 hover:bg-blue-50 transition">
                  <MessageCircle size={18} />
                  Message
                </button>
              )}
            </div>
          )}
        </div>
        {/* Tabbed Content */}
        <div className="w-[95%] m-auto mt-6 flex gap-6 h-full">
          {/* Sidebar Tabs */}
          <ProfileSidebarTabs
            activeMain="account"
            setActiveMain={() => {}}
            activeSub={activeTab}
            setActiveSub={setActiveTab}
            isOwnProfile={false}
            tabs={TABS}
            showOnlyMainTabs={true}
          />
          <div className="w-full shadow rounded-2xl bg-gray-50 min-h-[300px] p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPublicProfile;
