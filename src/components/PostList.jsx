import React from "react";
import Post from "./Post";

const PostList = ({ posts, profile, loading }) => {
  if (loading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  if (!posts || posts.length === 0) {
    return <div className="text-center py-8">No posts available. Be the first to post!</div>;
  }
  console.log(posts)

  return (
    <div className="space-y-2  ">
      {posts.map((post) => (
        <Post 
          key={post._id} 
          post={post} 
          profile={profile} 
        />
      ))}
    </div>
  );
};

export default PostList;
