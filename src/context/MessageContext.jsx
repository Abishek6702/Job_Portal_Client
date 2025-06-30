import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { io } from "socket.io-client";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [unreadLoading, setUnreadLoading] = useState(false);

  // 1. Socket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    const newSocket = io(`${import.meta.env.VITE_API_BASE_URL}`, {
      auth: { token },
      transports: ["websocket", "polling"],
    });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  // 2. Fetch initial unread counts
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      setUnreadLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/messages/unread-count`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setUnreadCounts(data);
      } catch (e) {
        setUnreadCounts({});
      } finally {
        setUnreadLoading(false);
      }
    };
    if (socket) fetchUnreadCounts();
  }, [socket]);

  // 3. Socket event listeners
useEffect(() => {
  if (!socket) return;

  const handleUnreadUpdate = ({ senderId, increment }) => {
    // If the chat with senderId is currently open, set count to 0 instantly
    const openChatUserId = window.location.pathname.split("/").pop();
    if (senderId === openChatUserId) {
      setUnreadCounts((prev) => ({ ...prev, [senderId]: 0 }));
    } else {
      setUnreadCounts((prev) => ({
        ...prev,
        [senderId]: increment ? (prev[senderId] || 0) + 1 : 0,
      }));
    }
  };

  socket.on("update-unread-count", handleUnreadUpdate);

  return () => {
    socket.off("update-unread-count", handleUnreadUpdate);
  };
}, [socket]);



  // 4. Mark as read (when chat is opened)
  const markMessagesRead = useCallback(async (senderId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/messages/read/${senderId}`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
      );
      setUnreadCounts((prev) => ({ ...prev, [senderId]: 0 }));
    } catch (err) {}
  }, []);

  // 5. Join user room for sockets
  const joinUserRoom = useCallback(
    (userId) => {
      if (socket) socket.emit("join-user", userId);
    },
    [socket]
  );

  return (
    <MessageContext.Provider
      value={{
        socket,
        unreadCounts,
        typingUsers,
        unreadLoading,
        joinUserRoom,
        markMessagesRead,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => useContext(MessageContext);
