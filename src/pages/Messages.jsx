import React, { useEffect, useState, useMemo } from "react";
import { Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import UserList from "../components/UserList";
import MessageDetail from "../components/MessageDetail";
import { MessageProvider } from "../context/MessageContext";

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.id || decoded.userId || decoded._id || null;
  } catch {
    return null;
  }
};

const Messages = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const currentUserId = getUserIdFromToken();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch all users
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => setAllUsers(data))
      .catch((err) => {
        console.error(err);
        setAllUsers([]);
      });
  }, []);

  // Fetch current user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const userId = currentUserId;
      if (!userId || !token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [currentUserId]);

  // Filter users: only connections
  const connections = useMemo(() => {
    if (!profile || !Array.isArray(allUsers)) return [];
    return allUsers.filter(
      (user) =>
        user._id !== profile._id && profile.connections?.includes(user._id)
    );
  }, [allUsers, profile]);

  const handleUserSelect = (userId) => {
    navigate(`/messages/${userId}`);
  };

  const handleBack = () => {
    navigate("/messages");
  };

  let showUserList = true;
  let showMessageDetail = true;
  if (isMobile) {
    if (location.pathname.match(/^\/messages\/[^/]+/)) {
      showUserList = false;
      showMessageDetail = true;
    } else {
      showUserList = true;
      showMessageDetail = false;
    }
  }

  return (
    <MessageProvider>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Messages</h2>
        <div className={`flex gap-4 h-[calc(100vh-150px)] ${isMobile ? "flex-col" : ""}`}>
          {showUserList && (
            <UserList
              users={connections}
              loading={loading}
              onUserSelect={handleUserSelect}
              isMobile={isMobile}
            />
          )}
          {showMessageDetail && (
            <Routes>
              <Route
                index
                element={
                  !isMobile ? (
                    <div className="w-full bg-white rounded shadow p-4 flex items-center justify-center">
                      <div className="text-gray-500 text-center">
                        <div className="text-xl mb-2">👋</div>
                        <p>Select a connection to start chatting</p>
                      </div>
                    </div>
                  ) : null
                }
              />
              <Route
                path=":userId"
                element={
                  <MessageDetail
                    isMobile={isMobile}
                    onBack={handleBack}
                  />
                }
              />
            </Routes>
          )}
        </div>
      </div>
    </MessageProvider>
  );
};

export default Messages;
