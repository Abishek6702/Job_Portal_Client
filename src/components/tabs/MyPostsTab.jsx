import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import ConfirmModal from "../ConfirmModal";
import { toast } from "react-toastify";

const getImageUrl = (relativePath, fallbackName = "User") => {
  if (relativePath && relativePath.trim() !== "") {
    const normalizedPath = relativePath.replace(/\\/g, "/");
    if (normalizedPath.startsWith("uploads/")) {
      return `${import.meta.env.VITE_API_BASE_URL}/${normalizedPath}`;
    }
    return `${import.meta.env.VITE_API_BASE_URL}/uploads/images/${normalizedPath}`;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}`;
};

const getFormattedTime = (createdAt) => {
  const date = new Date(createdAt);
  const now = new Date();
  const diff = now - date;
  const oneDay = 1000 * 60 * 60 * 24;
  if (diff < oneDay * 3) {
    return formatDistanceToNow(date, { addSuffix: true });
  } else {
    return format(date, "MMM d, yyyy");
  }
};

const MyPostsTab = ({ token, userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [openMenuPostId, setOpenMenuPostId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/posts/my-posts`,
          { userId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setPosts(response.data || []);
      } catch (error) {
        setPosts([]);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [userId]);

  const handleToggleComments = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleMenu = (postId) => {
    setOpenMenuPostId((prev) => (prev === postId ? null : postId));
  };

  const confirmDelete = (postId) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!postToDelete) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/posts/${postToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== postToDelete));
      toast.info("Post deleted successfully");
    } catch (err) {
      alert("Failed to delete post");
    } finally {
      setShowDeleteModal(false);
      setPostToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  if (loading) return <div>Loading your posts...</div>;
  if (!posts.length) return <div>No posts yet.</div>;

  return (
    <div>
      <ul className="space-y-6">
        {posts.map((post) => {
          const isOwnPost = token && post.author?._id === userId;

          return (
            <li
              key={post._id}
              className="bg-white rounded-2xl shadow p-5 relative"
            >
              {/* Show delete menu only if token and it's own post */}
              {isOwnPost && (
                <div className="absolute top-3 right-3">
                  <button onClick={() => toggleMenu(post._id)}>
                    <MoreHorizontal className="w-5 h-5 text-gray-600 hover:text-black" />
                  </button>
                  {openMenuPostId === post._id && (
                    <div className="absolute right-0 mt-2 bg-white rounded shadow w-32 z-50">
                      <button
                        className="w-full px-4 py-2 text-sm text-red-600 cursor-pointer flex items-center gap-2"
                        onClick={() => confirmDelete(post._id)}
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Post header */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={getImageUrl(
                    post.author?.onboarding?.profileImage,
                    post.author?.name
                  )}
                  alt={post.author?.name || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{post.author?.name || "You"}</h3>
                  <div className="text-xs text-gray-400">
                    {getFormattedTime(post.createdAt)}
                  </div>
                </div>
              </div>

              {/* Post content */}
              <h3 className="font-semibold mb-1">{post.title}</h3>
              <p className="text-gray-700 mb-3">{post.content}</p>
              {post.image && (
                <img
                  src={
                    post.image.startsWith("uploads/")
                      ? `${import.meta.env.VITE_API_BASE_URL}/${post.image.replace(/\\/g, "/")}`
                      : `${import.meta.env.VITE_API_BASE_URL}/uploads/resources/${post.image.replace(
                          /\\/g,
                          "/"
                        )}`
                  }
                  alt="Post"
                  className="w-full rounded-lg mb-3"
                />
              )}

              {/* Actions */}
              <div className="flex border-b border-gray-200 py-2 mb-3 text-gray-500 text-md font-semibold">
                <button className="flex items-center px-4 py-1" disabled>
                  <Heart className="w-4 h-4 mr-1" /> {post.likes?.length || 0} Like
                </button>
                <button className="flex items-center px-4 py-1" disabled>
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {post.comments?.length || 0} Comment
                </button>
                <button className="flex items-center px-4 py-1" disabled>
                  <Share2 className="w-4 h-4 mr-1" /> Share
                </button>
              </div>

              {/* Comments */}
              {post.comments?.length > 0 && (
                <div className="mt-2">
                  <div className="font-semibold mb-1">Comments:</div>
                  <ul className="space-y-2">
                    {(expandedPosts[post._id]
                      ? post.comments
                      : [post.comments[0]]
                    ).map((comment) => (
                      <li key={comment._id} className="flex items-start gap-2">
                        <img
                          src={getImageUrl(
                            comment.user?.onboarding?.profileImage,
                            comment.user?.name
                          )}
                          alt={comment.user?.name || "User"}
                          className="w-8 h-8 rounded-full mt-1"
                        />
                        <div className="bg-gray-100 rounded-lg p-2 flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {comment.user?.name || "User"}
                            </span>
                            <span className="text-xs text-gray-400">
                              {getFormattedTime(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-600">
                            {comment.text || comment.content}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {post.comments.length > 1 && (
                    <button
                      className="text-blue-600 hover:underline text-sm mt-2"
                      onClick={() => handleToggleComments(post._id)}
                    >
                      {expandedPosts[post._id]
                        ? "Hide comments"
                        : `See all (${post.comments.length})`}
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Confirm delete modal */}
      {showDeleteModal && (
        <ConfirmModal
          title="Delete Post"
          message="Are you sure you want to delete this post? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirmed}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
};

export default MyPostsTab;
