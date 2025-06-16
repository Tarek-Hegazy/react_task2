import React, { useState, useEffect } from "react";
import { getUserPostsAPI } from "@/api/post";
import { Link } from "react-router-dom";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getUserPostsAPI();
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch posts. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading posts...</span>
        </div>
        <p className="mt-2">Loading your posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4>Error loading posts</h4>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-danger"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center">
        <h2>No Posts Yet</h2>
        <p>You haven't created any posts yet. Start by creating one!</p>
        <Link to="/posts/create" className="btn btn-primary">
          Create Your First Post
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Posts</h2>
        <Link to="/posts/create" className="btn btn-success">
          + Create New Post
        </Link>
      </div>
      <div className="list-group">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/posts/${post.id}`}
            className="list-group-item list-group-item-action flex-column align-items-start"
          >
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{post.title}</h5>
              <small>
                {new Date(post.createdAt || Date.now()).toLocaleDateString()}
              </small>
            </div>
            <p className="mb-1">
              {post.content
                ? post.content.substring(0, 100) +
                  (post.content.length > 100 ? "..." : "")
                : "No content preview available."}
            </p>
            <small>Click to view full post</small>
          </Link>
        ))}
      </div>
    </div>
  );
}
